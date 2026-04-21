type Props = {
  children: React.ReactNode
  className?: string
  narrow?: boolean
}

export function PageWrapper({ children, className = '', narrow = false }: Props) {
  const maxW = narrow ? 'max-w-3xl' : 'max-w-6xl'
  return (
    <div className={`${maxW} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
