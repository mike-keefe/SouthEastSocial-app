const TZ = 'Europe/London'

export function formatEventDateTime(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    timeZone: TZ,
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatEventDateShort(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', {
    timeZone: TZ,
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatEventDateParts(iso: string): { day: number; weekday: string; month: string } {
  const fmt = (opts: Intl.DateTimeFormatOptions) =>
    new Intl.DateTimeFormat('en-GB', { timeZone: TZ, ...opts }).format(new Date(iso))
  return {
    day: Number(fmt({ day: 'numeric' })),
    weekday: fmt({ weekday: 'short' }).toUpperCase(),
    month: fmt({ month: 'short' }).toUpperCase(),
  }
}
