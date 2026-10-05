import { motion, useMotionTemplate } from 'motion/react'
import type { ReactNode } from 'react'
import { useMagnetic } from '../../lib/hooks'
import { ArrowRight } from './Icons'

type Variant = 'moss' | 'lime' | 'outline' | 'ink'

const STYLES: Record<Variant, string> = {
  moss: 'bg-moss text-white hover:bg-moss-dark',
  lime: 'bg-lime text-bark hover:bg-lime-deep',
  outline:
    'bg-transparent text-ink border border-ink/15 hover:border-ink/35 hover:bg-white',
  ink: 'bg-bark text-white hover:bg-ink',
}

/**
 * Magnetic button. The shell springs toward the pointer; the label trails at
 * a third of that so the two surfaces read as having depth between them.
 */
export function MagneticButton({
  children,
  variant = 'moss',
  className = '',
  href,
  onClick,
  arrow = false,
  strength = 0.3,
  type = 'button',
  'aria-label': ariaLabel,
}: {
  children: ReactNode
  variant?: Variant
  className?: string
  href?: string
  onClick?: () => void
  arrow?: boolean
  strength?: number
  type?: 'button' | 'submit'
  'aria-label'?: string
}) {
  const { ref, x, y } = useMagnetic(strength)
  const shellTransform = useMotionTemplate`translate3d(${x}px, ${y}px, 0)`

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        {arrow && (
          <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
        )}
      </span>
      {/* Sheen sweep on hover — decorative, fine-pointer only */}
      <span className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span className="absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-white/20 opacity-0 transition-[transform,opacity] duration-700 ease-out group-hover:translate-x-[320%] group-hover:opacity-100 max-[1024px]:hidden" />
      </span>
    </>
  )

  const classes = [
    'group pressable relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full',
    'px-6 py-3 text-sm font-medium will-change-transform',
    'transition-colors duration-200 ease-out',
    STYLES[variant],
    className,
  ].join(' ')

  const Tag = href ? motion.a : motion.button

  return (
    <Tag
      // Motion's ref typing differs per tag; the hook only reads getBoundingClientRect
      ref={ref as never}
      href={href}
      type={href ? undefined : type}
      onClick={onClick}
      aria-label={ariaLabel}
      className={classes}
      style={{ transform: shellTransform }}
    >
      {inner}
    </Tag>
  )
}

/** Small circular icon button — arrows, close, play. */
export function IconButton({
  children,
  onClick,
  disabled,
  label,
  className = '',
}: {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  label: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        'pressable grid h-11 w-11 place-items-center rounded-full border border-ink/12 bg-white/70 text-ink',
        'transition-[background-color,border-color,opacity] duration-200 ease-out',
        'hover:border-ink/25 hover:bg-white disabled:cursor-not-allowed disabled:opacity-35',
        className,
      ].join(' ')}
    >
      {children}
    </button>
  )
}
