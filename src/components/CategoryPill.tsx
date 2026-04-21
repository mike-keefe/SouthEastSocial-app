type Props = {
  name: string
  colour?: string | null
  size?: 'sm' | 'md'
}

function getTextColour(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  // Perceived luminance formula
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#1a1614' : '#ffffff'
}

export function CategoryPill({ name, colour, size = 'sm' }: Props) {
  const bg = colour ?? '#9e8f7e'
  const text = getTextColour(bg)
  const cls = size === 'md'
    ? 'inline-block px-3 py-1 rounded-full text-sm font-medium'
    : 'inline-block px-2 py-0.5 rounded-full text-xs font-medium'

  return (
    <span
      className={cls}
      style={{ backgroundColor: bg, color: text }}
    >
      {name}
    </span>
  )
}
