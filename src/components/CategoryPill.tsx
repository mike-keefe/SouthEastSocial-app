type Props = {
  name: string
  colour?: string | null
  size?: 'sm' | 'md'
}

function getContrastColor(hex: string): string {
  const clean = hex.startsWith('#') ? hex : '#b0ff00'
  const r = parseInt(clean.slice(1, 3), 16)
  const g = parseInt(clean.slice(3, 5), 16)
  const b = parseInt(clean.slice(5, 7), 16)
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? '#0a0a0a' : '#ffffff'
}

export function CategoryPill({ name, colour, size = 'sm' }: Props) {
  const bg = colour ?? '#b0ff00'
  const text = getContrastColor(bg)
  const cls =
    size === 'md'
      ? 'inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-[0.12em]'
      : 'inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.12em]'

  return (
    <span className={cls} style={{ backgroundColor: bg, color: text }}>
      {name}
    </span>
  )
}
