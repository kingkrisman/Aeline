import { useCallback, useEffect, useRef, useState } from 'react'
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from 'motion/react'
import type { PanInfo } from 'motion/react'
import { INITIATIVES } from '../lib/data'
import { EASE_OUT, SPRING } from '../lib/motion'
import { FadeWords, MaskedHeading, Reveal } from './ui/Reveal'
import { IconButton } from './ui/Button'
import { Img } from './ui/Img'
import { Newsletter } from './Newsletter'
import { ArrowLeft, ArrowRight, ArrowUpRight, Leaf } from './ui/Icons'

export function Initiatives() {
  return (
    <section
      id="initiatives"
      className="shell relative mx-2 mt-3 overflow-hidden bg-shell px-5 py-16 sm:mx-3 sm:px-8 lg:mx-4 lg:px-12 lg:py-20 xl:px-16"
    >
      <Carousel />
    </section>
  )
}

function Carousel() {
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  const [metrics, setMetrics] = useState({ step: 1, maxIndex: 0, maxScroll: 0 })
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const x = useMotionValue(0)

  /* Measure from the DOM rather than assuming a card width — the layout
     changes at three breakpoints and hardcoding it would drift. */
  useEffect(() => {
    const measure = () => {
      const vp = viewportRef.current
      const track = trackRef.current
      const first = track?.firstElementChild as HTMLElement | null
      if (!vp || !track || !first) return

      const gap = parseFloat(getComputedStyle(track).columnGap || '0') || 0
      const step = first.offsetWidth + gap
      const maxScroll = Math.max(0, track.scrollWidth - vp.offsetWidth)
      setMetrics({ step, maxScroll, maxIndex: step > 0 ? Math.ceil(maxScroll / step) : 0 })
    }

    measure()
    const ro = new ResizeObserver(measure)
    if (viewportRef.current) ro.observe(viewportRef.current)
    if (trackRef.current) ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  const goTo = useCallback(
    (next: number) => {
      const clamped = Math.max(0, Math.min(next, metrics.maxIndex))
      setIndex(clamped)
      animate(
        x,
        -Math.min(clamped * metrics.step, metrics.maxScroll),
        reduce ? { duration: 0.25, ease: EASE_OUT } : SPRING,
      )
    },
    [metrics, reduce, x],
  )

  // Re-clamp when a resize shortens the track under us
  useEffect(() => {
    if (index > metrics.maxIndex) goTo(metrics.maxIndex)
  }, [metrics.maxIndex, index, goTo])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    setDragging(false)
    // Project where the flick was heading, then snap to the nearest card.
    // Distance alone ignores a fast, short flick — which is most of them.
    const projected = -x.get() - info.velocity.x * 0.12
    goTo(Math.round(projected / metrics.step))
  }

  const progress = useTransform(x, [0, -(metrics.maxScroll || 1)], [0, 1], { clamp: true })
  const progressTransform = useMotionTemplate`scaleX(${progress})`

  return (
    // Three children so the mobile order can be eyebrow+heading → carousel →
    // newsletter, while the desktop keeps the carousel beside a stacked
    // copy/newsletter column.
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.32fr)_minmax(0,0.88fr)] lg:gap-12">
      {/* ---------------- Carousel ---------------- */}
      <div className="order-2 lg:order-none lg:col-start-1 lg:row-span-2 lg:row-start-1">
        <div className="mb-5 flex justify-end lg:hidden">
          <Arrows index={index} max={metrics.maxIndex} goTo={goTo} />
        </div>

        <div
          ref={viewportRef}
          data-cursor="drag"
          className="overflow-hidden"
          // The track is wider than the box; hiding the overflow is what
          // makes the drag read as a window onto a longer strip.
        >
          <motion.div
            ref={trackRef}
            drag="x"
            dragConstraints={{ left: -metrics.maxScroll, right: 0 }}
            // Friction past the ends, not a wall
            dragElastic={0.08}
            dragMomentum={false}
            onDragStart={() => setDragging(true)}
            onDragEnd={onDragEnd}
            style={{ x }}
            className="flex cursor-grab gap-3 active:cursor-grabbing"
          >
            {INITIATIVES.map((item, i) => (
              <InitiativeCard key={item.tag} {...item} index={i} dragging={dragging} />
            ))}
          </motion.div>
        </div>

        {/* Position readout. linear, because progress shouldn't ease. */}
        <div className="mt-6 h-px w-full bg-ink/10">
          <motion.div
            style={{ transform: progressTransform, transformOrigin: '0% 50%' }}
            className="h-px w-full bg-forest will-change-transform"
          />
        </div>
      </div>

      {/* ---------------- Copy ---------------- */}
      <div className="order-1 lg:order-none lg:col-start-2 lg:row-start-1">
        <div className="flex items-start justify-between">
          <span className="eyebrow">
            <Leaf className="h-3.5 w-3.5 text-forest" />
            Our Initiatives
          </span>
          <div className="hidden lg:block">
            <Arrows index={index} max={metrics.maxIndex} goTo={goTo} />
          </div>
        </div>

        <MaskedHeading
          className="mt-6 font-display text-[clamp(1.75rem,3.4vw,2.35rem)] font-medium leading-[1.12] text-ink"
          lines={['Real Actions. Real Impact.', 'A Better Future.']}
        />

        <FadeWords
          delay={0.12}
          text="Discover how we turn ideas into impact through projects that protect our planet and support communities."
          className="mt-4 max-w-[330px] text-[14px] leading-relaxed text-muted"
        />

        <Reveal delay={0.2}>
          <a
            href="#initiatives"
            className="group mt-5 inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink"
          >
            View All Initiatives
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
          </a>
        </Reveal>
      </div>

      {/* ---------------- Newsletter ---------------- */}
      <div className="order-3 lg:order-none lg:col-start-2 lg:row-start-2">
        <Newsletter />
      </div>
    </div>
  )
}

function Arrows({
  index,
  max,
  goTo,
}: {
  index: number
  max: number
  goTo: (i: number) => void
}) {
  return (
    <div className="flex gap-2">
      <IconButton label="Previous initiatives" disabled={index <= 0} onClick={() => goTo(index - 1)}>
        <ArrowLeft className="h-4 w-4" />
      </IconButton>
      <IconButton label="Next initiatives" disabled={index >= max} onClick={() => goTo(index + 1)}>
        <ArrowRight className="h-4 w-4" />
      </IconButton>
    </div>
  )
}

function InitiativeCard({
  tag,
  title,
  body,
  img,
  index,
  dragging,
}: {
  tag: string
  title: string
  body: string
  img: string
  index: number
  dragging: boolean
}) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0,28px,0)' }}
      whileInView={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.75, ease: EASE_OUT, delay: Math.min(index, 3) * 0.09 }}
      className="group w-[76vw] shrink-0 sm:w-[46vw] lg:w-[calc((100%-1.5rem)/3)]"
    >
      <div className="relative h-[210px] overflow-hidden rounded-[1.25rem] lg:h-[230px]">
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.06]">
          <Img id={img} alt={title.replace('\n', ' ')} width={700} />
        </div>

        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-medium text-ink backdrop-blur transition-transform duration-500 ease-out group-hover:-translate-y-0.5">
          {tag}
        </span>
      </div>

      <h3 className="mt-4 whitespace-pre-line font-display text-[1.05rem] font-medium leading-snug text-ink">
        {title}
      </h3>
      <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{body}</p>

      <a
        href="#initiatives"
        // A click that lands at the end of a drag is almost never intended
        onClick={(e) => dragging && e.preventDefault()}
        className="group/link mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ink"
      >
        Learn More
        <span className="grid h-5 w-5 place-items-center rounded-full border border-ink/15 transition-[background-color,border-color,transform] duration-300 ease-out group-hover/link:border-forest group-hover/link:bg-forest group-hover/link:text-white">
          <ArrowUpRight className="h-3 w-3" />
        </span>
      </a>
    </motion.article>
  )
}
