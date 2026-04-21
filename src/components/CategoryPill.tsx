type Props = {
  name: string
  colour?: string | null
  size?: 'sm' | 'md'
}

function getContrastColor(hex: string): string {
  const clean = hex.startsWith('#') ? hex : '#2563eb'
  const r = parseInt(clean.slice(1, 3), 16)
  const g = parseInt(clean.slice(3, 5), 16)
  const b = parseInt(clean.slice(5, 7), 16)
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? '#09090b' : '#ffffff'
}

export function CategoryPill({ name, colour, size = 'sm' }: Props) {
  const bg = colour ?? '#2563eb'
  const text = getContrastColor(bg)
  const cls =
    size === 'md'
      ? 'inline-block px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider'
      : 'inline-block px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-wider'

  return (
    <span className={cls} style={{ backgroundColor: bg, color: text }}>
      {name}
    </span>
  )
}
