import type { Transition, Variants } from 'motion/react'

/**
 * Shared motion tokens. Every curve and duration on the page comes from here
 * so nothing drifts into a hand-rolled cubic-bezier.
 */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const

/** Gesture / interruptible motion settles with a spring so velocity carries through. */
export const SPRING: Transition = { type: 'spring', duration: 0.5, bounce: 0.2 }
export const SPRING_SOFT: Transition = { type: 'spring', duration: 0.8, bounce: 0 }

/** Marketing surface — longer than the 300ms UI budget, on purpose. */
export const REVEAL: Transition = { duration: 0.8, ease: EASE_OUT }

/** Masked line reveal: the line rides up from behind its own overflow box. */
export const lineVariants: Variants = {
  hidden: { transform: 'translate3d(0, 110%, 0)' },
  show: { transform: 'translate3d(0, 0%, 0)' },
}

/** Standard scroll-in: a short lift plus opacity. Never a scale from zero. */
export const riseVariants: Variants = {
  hidden: { opacity: 0, transform: 'translate3d(0, 24px, 0)' },
  show: { opacity: 1, transform: 'translate3d(0, 0px, 0)' },
}

export const groupVariants = (stagger = 0.06, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
})

/** Viewport config used by every scroll reveal — fires once, slightly early. */
export const VIEW = { once: true, margin: '-12% 0px -12% 0px' } as const
