import { ChevronDown } from 'lucide-react'

type Props = React.SelectHTMLAttributes<HTMLSelectElement>

export function StyledSelect({ className = '', children, ...props }: Props) {
  return (
    <div className="relative">
      <select
        {...props}
        className={`w-full h-11 pl-4 pr-10 border border-neutral-700 bg-neutral-800 text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-primary-400 transition-colors ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none"
      />
    </div>
  )
}
