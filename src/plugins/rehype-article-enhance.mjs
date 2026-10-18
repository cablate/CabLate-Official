/**
 * rehype-article-enhance
 *
 * Build-time Markdown renderer upgrades for article content:
 * 1. `> [!NOTE] / [!TIP] / [!WARNING]` blockquotes -> semantic callout asides
 * 2. Standalone `![caption](src)` images -> <figure> + <figcaption>
 * 3. Fenced code blocks -> chrome wrapper (language label + copy button)
 * 4. Tables -> horizontally scrollable region with a11y label
 *
 * Hand-rolled hast walk (no unist-util-visit dependency).
 */

const CALLOUT_TYPES = {
  NOTE: { kind: 'note', title: '重點' },
  TIP: { kind: 'tip', title: '做法' },
  WARNING: { kind: 'warning', title: '注意' },
  CAUTION: { kind: 'warning', title: '注意' },
};

const LANG_LABELS = {
  typescript: 'TypeScript',
  ts: 'TypeScript',
  javascript: 'JavaScript',
  js: 'JavaScript',
  jsx: 'JSX',
  tsx: 'TSX',
  bash: 'Bash',
  sh: 'Bash',
  shell: 'Bash',
  console: 'Terminal',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  python: 'Python',
  py: 'Python',
  html: 'HTML',
  css: 'CSS',
  text: 'Text',
  plaintext: 'Text',
};

const el = (tagName, properties, children) => ({ type: 'element', tagName, properties, children });
const text = (value) => ({ type: 'text', value });

function toCallout(node) {
  const children = node.children || [];
  let cursor = 0;
  while (cursor < children.length && children[cursor].type === 'text' && !children[cursor].value.trim()) cursor++;
  const firstParagraph = children[cursor];
  if (firstParagraph?.type !== 'element' || firstParagraph.tagName !== 'p') return null;
  const firstTextNode = firstParagraph.children?.[0];
  if (firstTextNode?.type !== 'text') return null;

  const match = firstTextNode.value.match(/^\[!(NOTE|TIP|WARNING|CAUTION)\][ \t]*/);
  if (!match) return null;

  const meta = CALLOUT_TYPES[match[1]];
  let title = meta.title;
  let body = '';
  let rest = firstTextNode.value.slice(match[0].length);
  const newlineIndex = rest.indexOf('\n');
  if (newlineIndex >= 0) {
    const titleLine = rest.slice(0, newlineIndex).trim();
    if (titleLine) title = titleLine;
    body = rest.slice(newlineIndex + 1);
  } else if (rest.trim()) {
    title = rest.trim();
  }

  const remainingChildren = firstParagraph.children.slice(1);
  if (body.trim()) remainingChildren.unshift(text(body));
  firstParagraph.children = remainingChildren;

  node.tagName = 'aside';
  node.properties = { ...(node.properties || {}), className: ['article-callout', `article-callout--${meta.kind}`] };
  node.children = [el('p', { className: ['article-callout__title'] }, [text(title)]), ...node.children.filter((child) => !(child.type === 'element' && child.tagName === 'p' && child.children.length === 0))];
  return node;
}

function toFigure(paragraph) {
  const content = paragraph.children.filter((child) => !(child.type === 'text' && !child.value.trim()));
  if (content.length !== 1 || content[0].type !== 'element' || content[0].tagName !== 'img') return null;
  const img = content[0];
  const alt = String(img.properties?.alt ?? '').trim();
  if (!alt) return null;
  return el('figure', { className: ['article-figure'] }, [
    img,
    el('figcaption', { className: ['article-figure__caption'] }, [text(alt)]),
  ]);
}

function wrapCode(pre) {
  const code = pre.children?.find((child) => child.type === 'element' && child.tagName === 'code');
  const classNames = code?.properties?.className ?? [];
  const langClass = (Array.isArray(classNames) ? classNames : [classNames]).find(
    (name) => typeof name === 'string' && name.startsWith('language-'),
  );
  const lang = langClass ? langClass.slice('language-'.length).toLowerCase() : '';
  const label = LANG_LABELS[lang] ?? (lang ? lang.toUpperCase() : '程式碼');

  return el('div', { className: ['article-code'] }, [
    el('div', { className: ['article-code__head'] }, [
      el('span', { className: ['article-code__lang'] }, [text(label)]),
      el('button', {
        type: 'button',
        className: ['article-code__copy'],
        ['data-copy']: '',
        ariaLabel: '複製程式碼',
      }, [text('複製')]),
    ]),
    pre,
  ]);
}

function wrapTable(table) {
  return el('div', {
    className: ['article-table-wrap'],
    tabIndex: 0,
    role: 'region',
    ariaLabel: '表格，可左右捲動',
  }, [table]);
}

function replaceNode(node) {
  if (node.type !== 'element') return [node];
  if (node.tagName === 'blockquote') {
    const callout = toCallout(node);
    if (callout) return [callout];
    return [node];
  }
  if (node.tagName === 'p') {
    const figure = toFigure(node);
    if (figure) return [figure];
    return [node];
  }
  if (node.tagName === 'pre') return [wrapCode(node)];
  if (node.tagName === 'table') return [wrapTable(node)];
  return [node];
}

function transform(node) {
  if (!node.children) return;
  for (const child of node.children) transform(child);
  node.children = node.children.flatMap(replaceNode);
}

export function rehypeArticleEnhance() {
  return (tree) => {
    transform(tree);
  };
}
