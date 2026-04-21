import React from 'react'

type LexicalTextNode = {
  type: 'text'
  text: string
  format?: number
  version?: number
}

type LexicalElementNode = {
  type: string
  tag?: string
  listType?: string
  children?: LexicalNode[]
  version?: number
  direction?: string
  format?: string
  indent?: number
}

type LexicalNode = LexicalTextNode | LexicalElementNode

function serializeNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === 'text') {
    const textNode = node as LexicalTextNode
    let content: React.ReactNode = textNode.text
    const format = textNode.format ?? 0
    if (format & 1) content = <strong key={index}>{content}</strong>
    if (format & 2) content = <em key={index}>{content}</em>
    if (format & 8) content = <u key={index}>{content}</u>
    if (format & 16) content = <code key={`code-${index}`} className="bg-neutral-100 px-1 rounded text-sm font-mono">{content}</code>
    return content
  }

  const el = node as LexicalElementNode
  const children = el.children?.map((child, i) => serializeNode(child, i)) ?? null

  switch (el.type) {
    case 'paragraph':
      return <p key={index} className="mb-4 last:mb-0 leading-relaxed">{children}</p>
    case 'heading': {
      const tag = (el.tag ?? 'h2') as keyof React.JSX.IntrinsicElements
      const headingClasses: Record<string, string> = {
        h1: 'text-3xl font-bold mb-4 mt-6',
        h2: 'text-2xl font-bold mb-3 mt-5',
        h3: 'text-xl font-semibold mb-2 mt-4',
        h4: 'text-lg font-semibold mb-2 mt-3',
      }
      const cls = headingClasses[el.tag ?? 'h2'] ?? 'text-xl font-semibold mb-2'
      return React.createElement(tag, { key: index, className: cls }, children)
    }
    case 'list': {
      const Tag = el.listType === 'number' ? 'ol' : 'ul'
      const cls = el.listType === 'number'
        ? 'list-decimal list-inside mb-4 space-y-1'
        : 'list-disc list-inside mb-4 space-y-1'
      return <Tag key={index} className={cls}>{children}</Tag>
    }
    case 'listitem':
      return <li key={index} className="leading-relaxed">{children}</li>
    case 'quote':
      return (
        <blockquote key={index} className="border-l-4 border-primary-300 pl-4 italic mb-4 text-neutral-600">
          {children}
        </blockquote>
      )
    case 'linebreak':
      return <br key={index} />
    default:
      return <span key={index}>{children}</span>
  }
}

type RichTextProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  if (!content?.root?.children) return null

  const nodes = (content.root.children as LexicalNode[]).map((node, i) => serializeNode(node, i))

  return (
    <div className={className}>
      {nodes}
    </div>
  )
}
