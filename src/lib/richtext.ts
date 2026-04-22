// Utilities for converting between Payload's Lexical JSON format and HTML (used by Tiptap).

// Lexical text format bitmask values
const BOLD = 1
const ITALIC = 2
const CODE = 16

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function inlineToHtml(nodes: any[]): string {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (nodes ?? []).map((n: any) => {
    if (n.type === 'linebreak') return '<br>'
    if (n.type === 'link') {
      return `<a href="${escapeHtml(n.url ?? '#')}">${inlineToHtml(n.children ?? [])}</a>`
    }
    if (n.type !== 'text') return ''
    let t = escapeHtml(n.text ?? '')
    const fmt = n.format ?? 0
    if (fmt & CODE)   t = `<code>${t}</code>`
    if (fmt & BOLD)   t = `<strong>${t}</strong>`
    if (fmt & ITALIC) t = `<em>${t}</em>`
    return t
  }).join('')
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function blockToHtml(node: any): string {
  switch (node.type) {
    case 'paragraph':
      return `<p>${inlineToHtml(node.children) || '<br>'}</p>`
    case 'heading':
      return `<${node.tag}>${inlineToHtml(node.children)}</${node.tag}>`
    case 'list': {
      const tag = node.listType === 'number' ? 'ol' : 'ul'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const items = (node.children ?? []).map((item: any) =>
        `<li>${inlineToHtml(item.children ?? [])}</li>`
      ).join('')
      return `<${tag}>${items}</${tag}>`
    }
    case 'quote':
      return `<blockquote>${inlineToHtml(node.children)}</blockquote>`
    default:
      return ''
  }
}

export function lexicalToHtml(content: unknown): string {
  if (!content || typeof content !== 'object') return ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const root = (content as any).root
  if (!root?.children) return ''
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (root.children as any[]).map(blockToHtml).join('')
}

// --------------------------------------------------------------------------
// HTML → Lexical (runs client-side only, uses DOMParser)
// --------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseInlineNodes(el: Element): any[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nodes: any[] = []
  el.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? ''
      if (text) nodes.push({ type: 'text', text, format: 0, version: 1 })
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      const tag = (child as Element).tagName.toLowerCase()
      if (tag === 'br') {
        nodes.push({ type: 'linebreak', version: 1 })
      } else if (tag === 'strong' || tag === 'b') {
        parseInlineNodes(child as Element).forEach((n) => {
          nodes.push({ ...n, format: (n.format ?? 0) | BOLD })
        })
      } else if (tag === 'em' || tag === 'i') {
        parseInlineNodes(child as Element).forEach((n) => {
          nodes.push({ ...n, format: (n.format ?? 0) | ITALIC })
        })
      } else if (tag === 'code') {
        const text = child.textContent ?? ''
        if (text) nodes.push({ type: 'text', text, format: CODE, version: 1 })
      } else if (tag === 'a') {
        nodes.push({
          type: 'link',
          url: (child as HTMLAnchorElement).href ?? '#',
          version: 1,
          children: parseInlineNodes(child as Element),
        })
      } else {
        nodes.push(...parseInlineNodes(child as Element))
      }
    }
  })
  return nodes
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function emptyParagraph(): any {
  return { type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, children: [] }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function domToLexical(node: ChildNode): any[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = (node.textContent ?? '').trim()
    if (!text) return []
    return [{ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, children: [{ type: 'text', text, format: 0, version: 1 }] }]
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return []
  const el = node as Element
  const tag = el.tagName.toLowerCase()

  if (tag === 'p') {
    return [{ type: 'paragraph', version: 1, direction: 'ltr', format: '', indent: 0, children: parseInlineNodes(el) }]
  }
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
    return [{ type: 'heading', tag, version: 1, direction: 'ltr', format: '', indent: 0, children: parseInlineNodes(el) }]
  }
  if (tag === 'ul' || tag === 'ol') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items: any[] = Array.from(el.querySelectorAll(':scope > li')).map((li) => ({
      type: 'listitem',
      version: 1,
      direction: 'ltr',
      format: '',
      indent: 0,
      value: 1,
      checked: undefined,
      children: parseInlineNodes(li),
    }))
    return [{ type: 'list', listType: tag === 'ol' ? 'number' : 'bullet', start: 1, tag, version: 1, direction: 'ltr', format: '', indent: 0, children: items }]
  }
  if (tag === 'blockquote') {
    return [{ type: 'quote', version: 1, direction: 'ltr', format: '', indent: 0, children: parseInlineNodes(el) }]
  }
  return []
}

export function htmlToLexical(html: string): unknown {
  const children = typeof document !== 'undefined'
    ? Array.from(new DOMParser().parseFromString(html, 'text/html').body.childNodes).flatMap(domToLexical)
    : []

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: 'ltr',
      children: children.length > 0 ? children : [emptyParagraph()],
    },
  }
}
