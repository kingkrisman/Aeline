import { motion, useReducedMotion } from 'motion/react'
import type { ReactNode } from 'react'
import { EASE_OUT, REVEAL, VIEW, groupVariants, lineVariants, riseVariants } from '../../lib/motion'

/* ------------------------------------------------------------------ *
 * Scroll reveal. Marketing surface only — fires once, never replays.
 * ------------------------------------------------------------------ */

export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'p' | 'span'
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={
        reduce
          ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
          : riseVariants
      }
      transition={{ ...REVEAL, delay }}
    >
      {children}
    </MotionTag>
  )
}

/** Parent for staggered groups. Children should be <RevealItem>. */
export function RevealGroup({
  children,
  className,
  stagger = 0.07,
  delay = 0,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  delay?: number
  as?: 'div' | 'ul' | 'section'
}) {
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={groupVariants(stagger, delay)}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li' | 'p'
}) {
  const reduce = useReducedMotion()
  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag
      className={className}
      variants={
        reduce ? { hidden: { opacity: 0 }, show: { opacity: 1 } } : riseVariants
      }
      transition={REVEAL}
    >
      {children}
    </MotionTag>
  )
}

/* ------------------------------------------------------------------ *
 * Masked headline. Each line sits in its own overflow box and rides up
 * from behind it, so the text appears to be uncovered rather than moved.
 * ------------------------------------------------------------------ */

type HeadingProps = {
  /** One string per visual line. */
  lines: (string | ReactNode)[]
  className?: string
  lineClassName?: string
  delay?: number
  stagger?: number
  /** Animate on mount instead of on scroll — used by the hero. */
  immediate?: boolean
  as?: 'h1' | 'h2' | 'h3'
}

export function MaskedHeading({
  lines,
  className,
  lineClassName,
  delay = 0,
  stagger = 0.08,
  immediate = false,
  as = 'h2',
}: HeadingProps) {
  const reduce = useReducedMotion()
  const Tag = as

  const animateProps = immediate
    ? { animate: 'show' as const }
    : { whileInView: 'show' as const, viewport: VIEW }

  if (reduce) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        {...(immediate ? { animate: { opacity: 1 } } : { whileInView: { opacity: 1 }, viewport: VIEW })}
        transition={{ duration: 0.4, delay }}
      >
        <Tag className={className}>
          {lines.map((line, i) => (
            <span key={i} className={`block ${lineClassName ?? ''}`}>
              {line}
            </span>
          ))}
        </Tag>
      </motion.div>
    )
  }

  return (
    <Tag className={className}>
      <motion.span
        className="block"
        initial="hidden"
        {...animateProps}
        variants={groupVariants(stagger, delay)}
      >
        {lines.map((line, i) => (
          // The clip box. Padding-bottom keeps descenders from being sheared.
          <span key={i} className="block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className={`block will-change-transform ${lineClassName ?? ''}`}
              variants={lineVariants}
              transition={{ duration: 0.9, ease: EASE_OUT }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </motion.span>
    </Tag>
  )
}

/**
 * Word-level reveal for body copy. Cheaper visually than the masked
 * headline, so it stays subordinate to it.
 */
export function FadeWords({
  text,
  className,
  delay = 0,
  immediate = false,
}: {
  text: string
  className?: string
  delay?: number
  immediate?: boolean
}) {
  const reduce = useReducedMotion()
  const words = text.split(' ')

  if (reduce) {
    return (
      <motion.p
        className={className}
        initial={{ opacity: 0 }}
        {...(immediate ? { animate: { opacity: 1 } } : { whileInView: { opacity: 1 }, viewport: VIEW })}
        transition={{ duration: 0.4, delay }}
      >
        {text}
      </motion.p>
    )
  }

  return (
    <motion.p
      className={className}
      initial="hidden"
      {...(immediate ? { animate: 'show' as const } : { whileInView: 'show' as const, viewport: VIEW })}
      variants={groupVariants(0.022, delay)}
    >
      {words.map((word, i) => (
        <motion.span
          key={i}
          className="inline-block will-change-transform"
          variants={{
            hidden: { opacity: 0, transform: 'translate3d(0, 0.5em, 0)' },
            show: { opacity: 1, transform: 'translate3d(0, 0em, 0)' },
          }}
          transition={{ duration: 0.65, ease: EASE_OUT }}
        >
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.p>
  )
}
