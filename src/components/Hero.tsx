import { useRef, useState } from 'react'
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'motion/react'
import { AVATARS, HERO_CARDS, STATS } from '../lib/data'
import { useCountUp } from '../lib/hooks'
import { EASE_OUT } from '../lib/motion'
import { FadeWords, MaskedHeading } from './ui/Reveal'
import { Img } from './ui/Img'
import { TiltCard } from './ui/TiltCard'
import { ArrowRight, Check, Leaf, Play } from './ui/Icons'

export function Hero({ onPlay }: { onPlay: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()

  // Parallax is keyed to the hero's own exit, not to page scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 })

  const imageY = useTransform(smooth, [0, 1], [0, 90])
  const imageScale = useTransform(smooth, [0, 1], [1, 1.1])
  const cardsY = useTransform(smooth, [0, 1], [0, -70])
  const copyY = useTransform(smooth, [0, 1], [0, 40])
  const copyFade = useTransform(smooth, [0, 0.7], [1, 0])

  const imageTransform = useMotionTemplate`translate3d(0, ${imageY}px, 0) scale(${imageScale})`
  const cardsTransform = useMotionTemplate`translate3d(0, ${cardsY}px, 0)`
  const copyTransform = useMotionTemplate`translate3d(0, ${copyY}px, 0)`

  return (
    <section
      id="home"
      ref={ref}
      className="shell relative isolate mx-2 overflow-hidden bg-surface sm:mx-3 lg:mx-4"
    >
      {/* ---- Image plate ---------------------------------------------- */}
      <div className="absolute inset-y-0 right-0 hidden w-[51%] lg:block xl:w-[53%]">
        <motion.div
          initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
          animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.15 }}
          className="relative h-full w-full overflow-hidden rounded-l-[3rem]"
        >
          <motion.div
            style={reduce ? undefined : { transform: imageTransform }}
            className="parallax-layer absolute inset-0 will-change-transform"
          >
            <Img id={HERO_IMAGE} alt="Aerial view of forested hills" priority width={1800} />
          </motion.div>

          {/* Left feather so the plate dissolves into the white panel */}
          <span className="pointer-events-none absolute inset-y-0 left-0 w-28 bg-gradient-to-r from-surface via-surface/55 to-transparent" />
          <span className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-surface/60 to-transparent" />
        </motion.div>
      </div>

      {/* ---- Copy ------------------------------------------------------ */}
      <div className="relative z-10 px-5 pb-8 pt-28 sm:px-8 sm:pt-32 lg:px-12 lg:pb-10 lg:pt-36 xl:px-16">
        <motion.div
          style={reduce ? undefined : { transform: copyTransform, opacity: copyFade }}
          className="max-w-[560px] will-change-transform"
        >
          <motion.span
            initial={{ opacity: 0, transform: 'translate3d(0,10px,0)' }}
            animate={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.25 }}
            className="eyebrow"
          >
            <Leaf className="h-3.5 w-3.5 text-forest" />
            Together for a greener planet
          </motion.span>

          <MaskedHeading
            as="h1"
            immediate
            delay={0.32}
            stagger={0.09}
            className="mt-6 font-display text-[clamp(2.6rem,7.2vw,4.6rem)] font-medium leading-[0.98] text-ink"
            lines={[
              <>
                Save <span className="text-forest">Nature</span>,
              </>,
              'Save Tomorrow.',
            ]}
          />

          <FadeWords
            immediate
            delay={0.62}
            text="We unite communities, ideas, and actions to protect our planet and build a sustainable future for all."
            className="mt-6 max-w-[380px] text-[15px] leading-relaxed text-muted"
          />

          <EmailCapture />
          <SocialProof />
        </motion.div>
      </div>

      {/* ---- Mobile image --------------------------------------------- */}
      <motion.div
        initial={reduce ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
        animate={reduce ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.3 }}
        className="relative mx-5 mt-2 h-[300px] overflow-hidden rounded-3xl sm:mx-8 sm:h-[380px] lg:hidden"
      >
        <Img id={HERO_IMAGE} alt="Aerial view of forested hills" priority width={1000} />
        <div className="absolute inset-0 grid place-items-center">
          <WatchStory onPlay={onPlay} />
        </div>
      </motion.div>

      {/* ---- Play trigger, desktop ------------------------------------- */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 hidden w-[51%] items-center justify-start pl-[5%] lg:flex xl:w-[53%]">
        <div className="pointer-events-auto">
          <WatchStory onPlay={onPlay} />
        </div>
      </div>

      {/* ---- Floating capability cards --------------------------------- */}
      <motion.div
        style={reduce ? undefined : { transform: cardsTransform }}
        className="parallax-layer pointer-events-none absolute right-0 top-0 z-20 hidden h-full w-[40%] flex-col justify-center gap-4 pr-6 will-change-transform lg:flex xl:pr-10"
      >
        {HERO_CARDS.map((card, i) => (
          <FloatCard key={card.title} {...card} index={i} />
        ))}
      </motion.div>

      {/* Mobile: the same three, as a scroll-snapping row */}
      <div className="relative z-20 mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:px-8 lg:hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {HERO_CARDS.map((card, i) => (
          <div key={card.title} className="w-[260px] shrink-0 snap-start">
            <FloatCard {...card} index={i} static />
          </div>
        ))}
      </div>

      <Stats />
    </section>
  )
}

const HERO_IMAGE = '1501854140801-50d01698950b'

/* ------------------------------------------------------------------ *
 * Floating card
 * ------------------------------------------------------------------ */
function FloatCard({
  title,
  body,
  img,
  index,
  static: isStatic = false,
}: {
  title: string
  body: string
  img: string
  index: number
  static?: boolean
}) {
  const reduce = useReducedMotion()

  // Staggered horizontal offsets so the stack reads as a fan, not a column
  const offsets = ['lg:mr-0', 'lg:-mr-4', 'lg:mr-6']

  return (
    <motion.div
      initial={
        reduce
          ? { opacity: 0 }
          : { opacity: 0, transform: 'translate3d(28px, 12px, 0) scale(0.94)' }
      }
      animate={{ opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.85 + index * 0.11 }}
      className={`pointer-events-auto self-end ${isStatic ? '' : offsets[index]}`}
    >
      <div
        className={isStatic ? '' : 'animate-float-card'}
        style={{ animationDelay: `${index * -1.8}s` }}
      >
        <TiltCard max={11} lift={4} className="group">
          <div className="flex w-full items-center gap-3 rounded-2xl bg-white p-2.5 pr-4 shadow-[0_20px_45px_-22px_rgba(20,28,22,0.55)] lg:w-[250px]">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl">
              <Img id={img} alt="" width={200} />
            </span>
            <span className="min-w-0">
              <span className="block text-[13px] font-semibold leading-tight text-ink">{title}</span>
              <span className="mt-0.5 block text-[11.5px] leading-snug text-muted">{body}</span>
            </span>
          </div>
        </TiltCard>
      </div>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Watch our story
 * ------------------------------------------------------------------ */
function WatchStory({ onPlay }: { onPlay: () => void }) {
  const reduce = useReducedMotion()
  return (
    <motion.button
      type="button"
      onClick={onPlay}
      data-cursor="play"
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.9)' }}
      animate={{ opacity: 1, transform: 'scale(1)' }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 1 }}
      className="pressable group flex items-center gap-3"
    >
      <span className="relative grid h-14 w-14 place-items-center rounded-full bg-white/95 text-forest-deep shadow-lg backdrop-blur transition-colors duration-200 ease-out group-hover:bg-lime">
        {/* Ping ring — draws the eye to the one thing on the image you can click */}
        <span className="animate-pulse-ring absolute inset-0 rounded-full border border-white/80" />
        <Play className="ml-0.5 h-5 w-5" />
      </span>
      <span
        // The label lands on the photo, not on the white panel, so it is
        // reversed out with a dark halo rather than tinted ink
        className="text-[13.5px] font-medium text-white [text-shadow:0_1px_3px_rgba(20,28,22,0.55),0_1px_16px_rgba(20,28,22,0.45)]"
      >
        Watch Our Story
      </span>
    </motion.button>
  )
}

/* ------------------------------------------------------------------ *
 * Email capture — success is a state change, not a page reload
 * ------------------------------------------------------------------ */
function EmailCapture() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)
  const reduce = useReducedMotion()

  return (
    <motion.form
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0,14px,0)' }}
      animate={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.78 }}
      onSubmit={(e) => {
        e.preventDefault()
        if (!email.trim()) return
        setDone(true)
      }}
      className="mt-7 flex max-w-[400px] items-center gap-1.5 rounded-full border border-ink/12 bg-shell p-1.5 transition-colors duration-200 ease-out focus-within:border-forest/45"
    >
      <input
        type="email"
        required
        value={email}
        disabled={done}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        aria-label="Email address"
        className="min-w-0 flex-1 bg-transparent px-4 text-[14px] text-ink outline-none placeholder:text-muted disabled:opacity-60"
      />
      <button
        type="submit"
        className="pressable group relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full bg-moss px-5 py-2.5 text-[13.5px] font-medium text-white transition-colors duration-200 ease-out hover:bg-moss-dark"
      >
        <AnimatePresence mode="wait" initial={false}>
          {done ? (
            <motion.span
              key="done"
              initial={{ opacity: 0, transform: 'translate3d(0,8px,0)' }}
              animate={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              exit={{ opacity: 0, transform: 'translate3d(0,-8px,0)' }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="flex items-center gap-1.5"
            >
              Joined <Check className="h-4 w-4" />
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              initial={{ opacity: 0, transform: 'translate3d(0,8px,0)' }}
              animate={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
              exit={{ opacity: 0, transform: 'translate3d(0,-8px,0)' }}
              transition={{ duration: 0.22, ease: EASE_OUT }}
              className="flex items-center gap-1.5"
            >
              Join Us
              <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-0.5" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </motion.form>
  )
}

/* ------------------------------------------------------------------ *
 * Social proof cluster — the stack fans open on hover
 * ------------------------------------------------------------------ */
function SocialProof() {
  const reduce = useReducedMotion()
  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0,14px,0)' }}
      animate={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.9 }}
      className="group mt-5 flex items-center gap-3"
    >
      <div className="flex">
        {AVATARS.slice(0, 3).map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            loading="lazy"
            className="-ml-2.5 h-9 w-9 rounded-full border-2 border-surface object-cover first:ml-0 transition-transform duration-400 ease-out group-hover:translate-x-[var(--fan)] max-[1024px]:!translate-x-0"
            style={{ '--fan': `${i * 5}px` } as React.CSSProperties}
          />
        ))}
      </div>
      <p className="flex items-start gap-1.5 text-[12.5px] leading-tight text-muted">
        <Leaf className="mt-px h-3.5 w-3.5 shrink-0 text-forest" />
        <span>
          Join <span className="font-semibold text-ink">15,000+</span> people
          <br />
          making a difference
        </span>
      </p>
    </motion.div>
  )
}

/* ------------------------------------------------------------------ *
 * Stats strip
 * ------------------------------------------------------------------ */
function Stats() {
  return (
    <div className="relative z-10 grid grid-cols-2 gap-2.5 px-5 pb-6 pt-8 sm:px-8 lg:w-[49%] lg:grid-cols-4 lg:gap-2.5 lg:pb-10 lg:pl-12 lg:pr-2 xl:w-[47%] xl:pl-16">
      {STATS.map((stat, i) => (
        <StatCard key={stat.label} {...stat} index={i} />
      ))}
    </div>
  )
}

function StatCard({
  value,
  suffix,
  label,
  accent,
  index,
}: {
  value: number
  suffix: string
  label: string
  accent?: boolean
  index: number
}) {
  const { ref, value: shown } = useCountUp(value, 1.7)
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0,18px,0)' }}
      animate={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
      transition={{ duration: 0.7, ease: EASE_OUT, delay: 1.05 + index * 0.08 }}
      className={[
        'rounded-2xl border px-4 py-4 backdrop-blur-sm transition-colors duration-300 ease-out lg:px-4 lg:py-5',
        accent
          ? 'border-transparent bg-shell'
          : 'border-ink/10 bg-surface/80 hover:border-ink/25',
      ].join(' ')}
    >
      <p
        className={`font-display text-[clamp(1.5rem,3.2vw,2rem)] font-medium tracking-[-0.04em] ${
          accent ? 'text-forest' : 'text-ink'
        }`}
      >
        <span ref={ref}>{shown}</span>
        {suffix}
      </p>
      <p className="mt-1 text-[11px] tracking-[-0.01em] text-muted">{label}</p>
    </motion.div>
  )
}
