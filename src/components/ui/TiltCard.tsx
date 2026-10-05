import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from 'motion/react'
import type { ReactNode } from 'react'
import { useRef } from 'react'

/**
 * Pointer-driven 3D tilt with a glare that tracks the same point.
 * Springs, not durations — the pointer can reverse at any moment and the
 * card has to carry that velocity instead of restarting.
 *
 * Decorative, so it is gated to fine pointers and disabled under reduced
 * motion. Nothing here is load-bearing for reading the card.
 */
export function TiltCard({
  children,
  className = '',
  max = 9,
  glare = true,
  lift = 6,
}: {
  children: ReactNode
  className?: string
  max?: number
  glare?: boolean
  lift?: number
}) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const z = useMotionValue(0)
  const gx = useMotionValue(50)
  const gy = useMotionValue(50)
  const gOpacity = useMotionValue(0)

  const cfg = { stiffness: 190, damping: 20, mass: 0.7 }
  const srx = useSpring(rx, cfg)
  const sry = useSpring(ry, cfg)
  const sz = useSpring(z, cfg)
  const sgx = useSpring(gx, cfg)
  const sgy = useSpring(gy, cfg)
  const sgo = useSpring(gOpacity, { stiffness: 140, damping: 22 })

  const transform = useMotionTemplate`perspective(1000px) rotateX(${srx}deg) rotateY(${sry}deg) translate3d(0, ${sz}px, 0)`
  const glareBg = useMotionTemplate`radial-gradient(circle at ${sgx}% ${sgy}%, rgba(255,255,255,0.45), rgba(255,255,255,0) 55%)`

  const active = !reduce

  const onMove = (e: React.PointerEvent) => {
    if (!active || e.pointerType !== 'mouse') return
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    ry.set((px - 0.5) * max * 2)
    rx.set(-(py - 0.5) * max * 2)
    z.set(-lift)
    gx.set(px * 100)
    gy.set(py * 100)
    gOpacity.set(1)
  }

  const onLeave = () => {
    rx.set(0)
    ry.set(0)
    z.set(0)
    gOpacity.set(0)
  }

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      style={active ? { transform, transformStyle: 'preserve-3d' } : undefined}
      className={`relative will-change-transform ${className}`}
    >
      {children}
      {glare && active && (
        <motion.span
          aria-hidden="true"
          style={{ backgroundImage: glareBg, opacity: sgo }}
          className="pointer-events-none absolute inset-0 z-20 rounded-[inherit] mix-blend-soft-light"
        />
      )}
    </motion.div>
  )
}
