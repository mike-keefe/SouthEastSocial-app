'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

type Props = {
  id?: string
  value: string            // "YYYY-MM-DDTHH:MM" or ""
  onChange: (iso: string) => void
  min?: string
  required?: boolean
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_LABELS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']
const MINUTE_OPTIONS = [0, 15, 30, 45]

function parseLocal(iso: string) {
  if (!iso || iso.length < 16) return null
  const [datePart, timePart] = iso.split('T')
  const [year, month, day] = datePart.split('-').map(Number)
  const [hour, minute] = timePart.split(':').map(Number)
  if ([year, month, day, hour, minute].some(isNaN)) return null
  return { year, month: month - 1, day, hour, minute }
}

function buildIso(year: number, month: number, day: number, hour: number, minute: number) {
  return [
    `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
  ].join('T')
}

function formatDisplay(iso: string) {
  const p = parseLocal(iso)
  if (!p) return ''
  const d = new Date(p.year, p.month, p.day)
  const datePart = d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  const timePart = `${String(p.hour).padStart(2, '0')}:${String(p.minute).padStart(2, '0')}`
  return `${datePart} at ${timePart}`
}

function nearestQuarter(minute: number) {
  return MINUTE_OPTIONS.reduce((best, m) =>
    Math.abs(m - minute) < Math.abs(best - minute) ? m : best
  , 0)
}

export function DateTimePicker({ id, value, onChange, min, required }: Props) {
  const parsed = parseLocal(value)
  const today = new Date()

  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(parsed?.year ?? today.getFullYear())
  const [viewMonth, setViewMonth] = useState(parsed?.month ?? today.getMonth())
  const [selDate, setSelDate] = useState(parsed ? { year: parsed.year, month: parsed.month, day: parsed.day } : null)
  const [hour, setHour] = useState(parsed?.hour ?? 19)
  const [minute, setMinute] = useState(parsed ? nearestQuarter(parsed.minute) : 0)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onOutsideClick)
    return () => document.removeEventListener('mousedown', onOutsideClick)
  }, [open])

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  function pickDay(day: number) {
    const d = { year: viewYear, month: viewMonth, day }
    setSelDate(d)
    onChange(buildIso(d.year, d.month, d.day, hour, minute))
  }

  function pickTime(h: number, m: number) {
    setHour(h)
    setMinute(m)
    if (selDate) onChange(buildIso(selDate.year, selDate.month, selDate.day, h, m))
  }

  // Build calendar grid (Monday-first)
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const rawFirstDay = new Date(viewYear, viewMonth, 1).getDay() // 0=Sun
  const firstDay = rawFirstDay === 0 ? 6 : rawFirstDay - 1

  const minParsed = min ? parseLocal(min) : null

  function isDisabled(day: number) {
    if (!minParsed) return false
    const cell = new Date(viewYear, viewMonth, day)
    const minD = new Date(minParsed.year, minParsed.month, minParsed.day)
    return cell < minD
  }

  const isToday = (day: number) =>
    today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear

  const isSelected = (day: number) =>
    selDate?.day === day && selDate?.month === viewMonth && selDate?.year === viewYear

  return (
    <div ref={containerRef} className="relative">
      {/* Hidden field keeps form validation working */}
      <input type="hidden" id={id} value={value} required={required} />

      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full h-11 px-4 flex items-center gap-3 border border-neutral-700 bg-neutral-800 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary-400 hover:border-neutral-600 transition-colors"
      >
        <Calendar size={14} className="text-neutral-500 shrink-0" />
        <span className={value ? 'text-white' : 'text-neutral-600'}>
          {value ? formatDisplay(value) : 'Pick a date and time'}
        </span>
      </button>

      {open && (
        <div className="absolute z-50 top-full mt-1 left-0 bg-neutral-900 border border-neutral-700 shadow-2xl w-72">

          {/* Month nav */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
            <button type="button" onClick={prevMonth} className="p-1 text-neutral-400 hover:text-white transition-colors">
              <ChevronLeft size={14} />
            </button>
            <span className="text-sm font-semibold text-white tracking-tight">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" onClick={nextMonth} className="p-1 text-neutral-400 hover:text-white transition-colors">
              <ChevronRight size={14} />
            </button>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 px-3 pt-2.5">
            {DAY_LABELS.map(d => (
              <div key={d} className="text-center text-[10px] font-bold text-neutral-600 pb-1">{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div className="grid grid-cols-7 px-3 pb-3 gap-y-0.5">
            {Array.from({ length: firstDay }, (_, i) => <div key={`pad-${i}`} />)}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
              const disabled = isDisabled(day)
              const selected = isSelected(day)
              const todayDay = isToday(day)
              return (
                <button
                  key={day}
                  type="button"
                  disabled={disabled}
                  onClick={() => pickDay(day)}
                  className={`text-[13px] py-1.5 text-center transition-colors focus:outline-none ${
                    selected
                      ? 'bg-primary-400 text-black font-bold'
                      : todayDay
                        ? 'text-primary-400 font-semibold hover:bg-neutral-800'
                        : disabled
                          ? 'text-neutral-700 cursor-not-allowed'
                          : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                  }`}
                >
                  {day}
                </button>
              )
            })}
          </div>

          {/* Time picker */}
          <div className="border-t border-neutral-800 px-4 py-3 space-y-2.5">
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-neutral-600">Time</p>
            <div className="flex items-center gap-2">
              {/* Hour dropdown */}
              <select
                value={hour}
                onChange={e => pickTime(Number(e.target.value), minute)}
                className="w-20 h-9 px-2 bg-neutral-800 border border-neutral-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
              >
                {Array.from({ length: 24 }, (_, h) => (
                  <option key={h} value={h}>{String(h).padStart(2, '0')}h</option>
                ))}
              </select>

              {/* Minute chips */}
              <div className="flex gap-1.5 flex-1">
                {MINUTE_OPTIONS.map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => pickTime(hour, m)}
                    className={`flex-1 h-9 text-xs font-medium transition-colors focus:outline-none ${
                      minute === m
                        ? 'bg-primary-400 text-black font-bold'
                        : 'bg-neutral-800 border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500'
                    }`}
                  >
                    :{String(m).padStart(2, '0')}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  )
}
