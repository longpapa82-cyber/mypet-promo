// md.mjs — 자체 미니 마크다운 파서 (의존성 0, 네트워크 0, 순수 Node ESM)
//
// export function parseMarkdown(raw) -> { frontmatter, html }
//
// 지원 범위 (blog-menu.design.md §8 + blog.css 클래스에 정합):
//   - 프론트매터: 상단 `---` ... `---` 사이 key: value
//       · `tags: [a, b, c]`  → 문자열 배열
//       · `disclaimer: true` → boolean (true/false)
//       · 그 외              → 문자열 (양끝 따옴표 제거)
//   - 블록: # ## ###(h1~h3), 빈 줄 구분 문단<p>, - / * 리스트<ul>, 1. 리스트<ol>,
//           ![alt](src) 이미지<img loading="lazy">, 표(| a | b | + |---|---|)<table>,
//           :::tip / :::warning / :::disclaimer ... :::  → <div class="tip|warning|disclaimer">
//   - 인라인: **굵게**<strong>, [텍스트](url)<a>
//
// 보안: HTML escape(&<>")는 "텍스트 노드"에만 적용(마크업 토큰은 escape 대상 아님).
//       MD는 신뢰 소스(직접 작성) 전제 — 사용자 입력 렌더 금지.

// ── HTML escape (텍스트 노드용) ────────────────────────────────────
function escapeHtml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// url 속성값 escape: 텍스트 escape + 작은따옴표까지(속성 안전)
function escapeAttr(text) {
  return escapeHtml(text).replace(/'/g, '&#39;');
}

// ── 인라인 파싱: **bold**, [text](url) ─────────────────────────────
// 전략: 특수 토큰(link/bold)을 순서대로 스캔하며 사이의 일반 텍스트만 escape.
function parseInline(text) {
  let out = '';
  let i = 0;
  const n = text.length;

  while (i < n) {
    // 1) 링크 [text](url)
    if (text[i] === '[') {
      const link = matchLink(text, i);
      if (link) {
        out += '<a href="' + escapeAttr(link.url) + '">' + parseInline(link.label) + '</a>';
        i = link.end;
        continue;
      }
    }

    // 2) 굵게 **text**
    if (text[i] === '*' && text[i + 1] === '*') {
      const bold = matchBold(text, i);
      if (bold) {
        out += '<strong>' + parseInline(bold.inner) + '</strong>';
        i = bold.end;
        continue;
      }
    }

    // 3) 일반 텍스트 1글자 — escape
    out += escapeHtml(text[i]);
    i += 1;
  }

  return out;
}

// [label](url) 매치. 실패 시 null.
function matchLink(text, start) {
  // label: 다음 대괄호 닫힘까지 (중첩 대괄호 미지원 — 단순화)
  const closeBracket = text.indexOf(']', start + 1);
  if (closeBracket === -1) return null;
  if (text[closeBracket + 1] !== '(') return null;
  const closeParen = text.indexOf(')', closeBracket + 2);
  if (closeParen === -1) return null;

  const label = text.slice(start + 1, closeBracket);
  const url = text.slice(closeBracket + 2, closeParen).trim();
  return { label, url, end: closeParen + 1 };
}

// **inner** 매치. 실패 시 null.
function matchBold(text, start) {
  const closeIdx = text.indexOf('**', start + 2);
  if (closeIdx === -1) return null;
  const inner = text.slice(start + 2, closeIdx);
  if (inner.length === 0) return null; // 빈 ** ** 는 무시
  return { inner, end: closeIdx + 2 };
}

// ── 프론트매터 파싱 ────────────────────────────────────────────────
// 상단 `---` 로 시작해 다음 `---` 까지. 반환: { frontmatter, bodyStartIndex(줄 배열 인덱스) }
function parseFrontmatter(lines) {
  const frontmatter = {};
  if (lines.length === 0 || lines[0].trim() !== '---') {
    return { frontmatter, bodyStart: 0 };
  }

  let i = 1;
  for (; i < lines.length; i += 1) {
    if (lines[i].trim() === '---') {
      i += 1; // 닫는 --- 다음 줄부터 본문
      break;
    }
    const line = lines[i];
    const colon = line.indexOf(':');
    if (colon === -1) continue; // key: value 아니면 스킵

    const key = line.slice(0, colon).trim();
    const rawValue = line.slice(colon + 1).trim();
    if (key === '') continue;

    frontmatter[key] = parseFrontmatterValue(rawValue);
  }

  return { frontmatter, bodyStart: i };
}

function parseFrontmatterValue(raw) {
  // 배열: [a, b, c]
  if (raw.startsWith('[') && raw.endsWith(']')) {
    const inner = raw.slice(1, -1).trim();
    if (inner === '') return [];
    return inner
      .split(',')
      .map((item) => stripQuotes(item.trim()))
      .filter((item) => item !== '');
  }
  // boolean
  if (raw === 'true') return true;
  if (raw === 'false') return false;
  // 문자열 (양끝 따옴표 제거)
  return stripQuotes(raw);
}

function stripQuotes(s) {
  if (s.length >= 2) {
    const first = s[0];
    const last = s[s.length - 1];
    if ((first === '"' && last === '"') || (first === "'" && last === "'")) {
      return s.slice(1, -1);
    }
  }
  return s;
}

// ── 라인 기반 블록 파싱 ────────────────────────────────────────────
function parseBlocks(lines) {
  const blocks = [];
  let i = 0;
  const n = lines.length;

  while (i < n) {
    const line = lines[i];
    const trimmed = line.trim();

    // 빈 줄 스킵
    if (trimmed === '') {
      i += 1;
      continue;
    }

    // :::tip / :::warning / :::disclaimer 펜스
    const fence = matchCalloutOpen(trimmed);
    if (fence) {
      const res = collectCallout(lines, i + 1, fence.kind);
      blocks.push('<div class="' + fence.kind + '">' + res.html + '</div>');
      i = res.next;
      continue;
    }

    // 표: 현재 줄이 | 로 시작하고, 다음 줄이 구분자(|---|)면 표
    if (trimmed.startsWith('|') && i + 1 < n && isTableSeparator(lines[i + 1])) {
      const res = collectTable(lines, i);
      blocks.push(res.html);
      i = res.next;
      continue;
    }

    // 헤딩 # ## ###
    const heading = matchHeading(trimmed);
    if (heading) {
      blocks.push('<h' + heading.level + '>' + parseInline(heading.text) + '</h' + heading.level + '>');
      i += 1;
      continue;
    }

    // 이미지 단독 줄 ![alt](src)
    const img = matchImageLine(trimmed);
    if (img) {
      blocks.push(renderImage(img));
      i += 1;
      continue;
    }

    // 순서 없는 리스트 - / *
    if (isUnorderedItem(trimmed)) {
      const res = collectList(lines, i, 'ul');
      blocks.push(res.html);
      i = res.next;
      continue;
    }

    // 순서 있는 리스트 1.
    if (isOrderedItem(trimmed)) {
      const res = collectList(lines, i, 'ol');
      blocks.push(res.html);
      i = res.next;
      continue;
    }

    // 그 외: 문단 (빈 줄까지 병합)
    const res = collectParagraph(lines, i);
    blocks.push('<p>' + res.html + '</p>');
    i = res.next;
  }

  return blocks.join('\n');
}

// ── 헤딩 ───────────────────────────────────────────────────────────
function matchHeading(trimmed) {
  const m = /^(#{1,3})\s+(.*)$/.exec(trimmed);
  if (!m) return null;
  return { level: m[1].length, text: m[2].trim() };
}

// ── 이미지 ─────────────────────────────────────────────────────────
function matchImageLine(trimmed) {
  const m = /^!\[([^\]]*)\]\(([^)]*)\)$/.exec(trimmed);
  if (!m) return null;
  return { alt: m[1], src: m[2].trim() };
}

function renderImage(img) {
  return (
    '<img loading="lazy" src="' +
    escapeAttr(img.src) +
    '" alt="' +
    escapeAttr(img.alt) +
    '" />'
  );
}

// ── 콜아웃 펜스 :::tip … ::: ───────────────────────────────────────
function matchCalloutOpen(trimmed) {
  const m = /^:::\s*(tip|warning|disclaimer)\s*$/.exec(trimmed);
  if (!m) return null;
  return { kind: m[1] };
}

function collectCallout(lines, start, _kind) {
  const inner = [];
  let i = start;
  const n = lines.length;
  for (; i < n; i += 1) {
    if (lines[i].trim() === ':::') {
      i += 1; // 닫는 ::: 소비
      break;
    }
    inner.push(lines[i]);
  }
  // 내부는 블록 파서 재귀 (문단/리스트 등 지원)
  const html = parseBlocks(inner);
  return { html, next: i };
}

// ── 리스트 (ul / ol) ───────────────────────────────────────────────
function isUnorderedItem(trimmed) {
  return /^[-*]\s+/.test(trimmed);
}

function isOrderedItem(trimmed) {
  return /^\d+\.\s+/.test(trimmed);
}

function collectList(lines, start, tag) {
  const items = [];
  let i = start;
  const n = lines.length;
  const isItem = tag === 'ul' ? isUnorderedItem : isOrderedItem;

  for (; i < n; i += 1) {
    const trimmed = lines[i].trim();
    if (trimmed === '') break; // 빈 줄에서 리스트 종료
    if (!isItem(trimmed)) break; // 다른 블록 시작
    const content =
      tag === 'ul'
        ? trimmed.replace(/^[-*]\s+/, '')
        : trimmed.replace(/^\d+\.\s+/, '');
    items.push('<li>' + parseInline(content) + '</li>');
  }

  const html = '<' + tag + '>' + items.join('') + '</' + tag + '>';
  return { html, next: i };
}

// ── 표 ─────────────────────────────────────────────────────────────
function isTableSeparator(line) {
  const t = line.trim();
  if (!t.startsWith('|')) return false;
  // | --- | :--: | ---: | 형태의 셀들만 있어야 함
  return /^\|(\s*:?-{1,}:?\s*\|)+$/.test(t);
}

function splitTableRow(line) {
  let t = line.trim();
  // 양끝 파이프 제거
  if (t.startsWith('|')) t = t.slice(1);
  if (t.endsWith('|')) t = t.slice(0, -1);
  return t.split('|').map((cell) => cell.trim());
}

function collectTable(lines, start) {
  const headerCells = splitTableRow(lines[start]);
  let i = start + 2; // 헤더 + 구분자 다음
  const n = lines.length;
  const bodyRows = [];

  for (; i < n; i += 1) {
    const trimmed = lines[i].trim();
    if (trimmed === '' || !trimmed.startsWith('|')) break;
    bodyRows.push(splitTableRow(lines[i]));
  }

  const thead =
    '<thead><tr>' +
    headerCells.map((c) => '<th>' + parseInline(c) + '</th>').join('') +
    '</tr></thead>';

  const tbody =
    '<tbody>' +
    bodyRows
      .map(
        (row) =>
          '<tr>' + row.map((c) => '<td>' + parseInline(c) + '</td>').join('') + '</tr>'
      )
      .join('') +
    '</tbody>';

  return { html: '<table>' + thead + tbody + '</table>', next: i };
}

// ── 문단 ───────────────────────────────────────────────────────────
// 빈 줄까지 이어지는 연속 텍스트 줄을 하나의 문단으로(줄바꿈은 공백으로 병합).
function collectParagraph(lines, start) {
  const buf = [];
  let i = start;
  const n = lines.length;

  for (; i < n; i += 1) {
    const line = lines[i];
    const trimmed = line.trim();
    if (trimmed === '') break;
    // 새 블록 시작 신호면 문단 종료 (헤딩·리스트·표·펜스·이미지)
    if (i > start) {
      if (
        matchHeading(trimmed) ||
        matchCalloutOpen(trimmed) ||
        isUnorderedItem(trimmed) ||
        isOrderedItem(trimmed) ||
        matchImageLine(trimmed) ||
        (trimmed.startsWith('|') && i + 1 < n && isTableSeparator(lines[i + 1]))
      ) {
        break;
      }
    }
    buf.push(trimmed);
  }

  const html = parseInline(buf.join(' '));
  return { html, next: i };
}

// ── 진입점 ─────────────────────────────────────────────────────────
export function parseMarkdown(raw) {
  // 개행 정규화(CRLF/CR → LF)
  const normalized = String(raw).replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  const { frontmatter, bodyStart } = parseFrontmatter(lines);
  const bodyLines = lines.slice(bodyStart);
  const html = parseBlocks(bodyLines);

  return { frontmatter, html };
}
