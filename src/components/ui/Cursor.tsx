import { useEffect, useState } from 'react'
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import { useFinePointer } from '../../lib/hooks'
import { EASE_OUT } from '../../lib/motion'

type Mode = 'default' | 'link' | 'drag' | 'play'

const LABEL: Partial<Record<Mode, string>> = { drag: 'Drag', play: 'Play' }

/**
 * Trailing cursor ring. Mouse-only decoration: it never replaces the native
 * cursor (that stays visible), it just adds a spring-lagged companion that
 * swells over interactive targets.
 */
export function Cursor() {
  const fine = useFinePointer()
  const reduce = useReducedMotion()
  const [mode, setMode] = useState<Mode>('default')
  const [visible, setVisible] = useState(false)

  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 380, damping: 32, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 380, damping: 32, mass: 0.5 })
  const transform = useMotionTemplate`translate3d(${sx}px, ${sy}px, 0) translate(-50%, -50%)`

  const enabled = fine && !reduce

  useEffect(() => {
    if (!enabled) return

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      x.set(e.clientX)
      y.set(e.clientY)
      setVisible(true)

      const el = (e.target as HTMLElement | null)?.closest?.(
        '[data-cursor], a, button, input, [role="button"]',
      ) as HTMLElement | null

      const declared = el?.dataset?.cursor as Mode | undefined
      setMode(declared ?? (el ? 'link' : 'default'))
    }

    const onLeave = () => setVisible(false)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerleave', onLeave)
    }
  }, [enabled, x, y])

  if (!enabled) return null

  // The box stays a fixed BASE px; only the inner disc scales. Animating
  // width/height here would relayout on every frame.
  const size = mode === 'default' ? 18 : mode === 'link' ? 46 : 68
  const label = LABEL[mode]

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[90] grid place-items-center mix-blend-multiply"
      style={{ transform, width: BASE, height: BASE }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.2, ease: EASE_OUT }}
    >
      <motion.span
        className="absolute inset-0 rounded-full will-change-transform"
        animate={{
          transform: `scale(${size / BASE})`,
          backgroundColor:
            mode === 'default' ? 'rgba(20,28,22,0.55)' : 'rgba(207,238,82,0.92)',
        }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.22 }}
      />
      {label && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.15, ease: EASE_OUT }}
          className="relative text-[10px] font-semibold uppercase tracking-[0.12em] text-bark"
        >
          {label}
        </motion.span>
      )}
    </motion.div>
  )
}

/** Largest state the cursor reaches; every smaller state scales down from it. */
const BASE = 68

/** Hairline scroll indicator. linear — progress should never ease. */
export function ScrollProgress({ progress }: { progress: import('motion/react').MotionValue<number> }) {
  const transform = useMotionTemplate`scaleX(${progress})`
  return (
    <motion.div
      aria-hidden="true"
      style={{ transform, transformOrigin: '0% 50%' }}
      className="fixed inset-x-0 top-0 z-[80] h-[2px] bg-gradient-to-r from-forest via-lime to-forest will-change-transform"
    />
  )
}
