import { useRef } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { PILLARS } from '../lib/data'
import { EASE_OUT, VIEW } from '../lib/motion'
import { FadeWords, MaskedHeading, Reveal } from './ui/Reveal'
import { MagneticButton } from './ui/Button'
import { Img } from './ui/Img'
import { ICONS, Leaf } from './ui/Icons'

export function Mission() {
  return (
    <section
      id="mission"
      className="shell relative mx-2 mt-3 overflow-hidden bg-shell px-5 py-16 sm:mx-3 sm:px-8 lg:mx-4 lg:px-12 lg:py-20 xl:px-16"
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.3fr)] lg:gap-14">
        {/* ---- Copy column ---- */}
        <div className="lg:pt-2">
          <Reveal>
            <span className="eyebrow">
              <Leaf className="h-3.5 w-3.5 text-forest" />
              Our Mission
            </span>
          </Reveal>

          <MaskedHeading
            className="mt-6 font-display text-[clamp(2.1rem,4.6vw,3.1rem)] font-medium leading-[1.03] text-ink"
            lines={[
              "We're Building",
              <>
                a <span className="text-forest">Greener</span>,
              </>,
              'Cleaner, Stronger',
              'World.',
            ]}
          />

          <FadeWords
            delay={0.15}
            text="Through education, action, and innovation, we empower people to protect nature and create lasting change."
            className="mt-6 max-w-[330px] text-[14.5px] leading-relaxed text-muted"
          />

          <Reveal delay={0.25} className="mt-8 flex flex-wrap items-center gap-2.5">
            <MagneticButton variant="moss" href="#initiatives" arrow>
              Explore Projects
            </MagneticButton>
            <MagneticButton variant="outline" href="#about">
              Learn More
            </MagneticButton>
          </Reveal>
        </div>

        {/* ---- Pillar cards ---- */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <PillarCard key={pillar.title} {...pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}

function PillarCard({
  title,
  body,
  img,
  icon,
  index,
}: {
  title: string
  body: string
  img: string
  icon: keyof typeof ICONS
  index: number
}) {
  const Icon = ICONS[icon]
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  // Each card's image drifts at a slightly different rate — the depth cue
  // that keeps three identical frames from reading as wallpaper.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.4 })
  const shift = useTransform(smooth, [0, 1], [-14 - index * 4, 14 + index * 4])
  const imgTransform = useMotionTemplate`translate3d(0, ${shift}px, 0) scale(1.14)`

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={
        reduce
          ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
          : {
              hidden: { clipPath: 'inset(0 0 100% 0)' },
              show: { clipPath: 'inset(0 0 0% 0)' },
            }
      }
      transition={{ duration: 0.85, ease: EASE_OUT, delay: index * 0.1 }}
      className="group relative h-[320px] overflow-hidden rounded-[1.4rem] sm:h-[400px] lg:h-[440px]"
    >
      <motion.div
        style={reduce ? undefined : { transform: imgTransform }}
        className="parallax-layer absolute inset-0 will-change-transform"
      >
        <Img id={img} alt={title.replace('\n', ' ')} width={700} />
      </motion.div>

      {/* Legibility scrim, deepened on hover so the label gains contrast */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bark/85 via-bark/25 to-transparent transition-opacity duration-500 ease-out group-hover:opacity-90" />

      <div className="absolute inset-x-0 bottom-0 p-4 lg:p-5">
        <span className="mb-4 grid h-10 w-10 place-items-center rounded-full bg-white/90 text-forest-deep backdrop-blur transition-transform duration-500 ease-out group-hover:rotate-[18deg] group-hover:scale-110">
          <Icon className="h-[18px] w-[18px]" />
        </span>

        {/* Title holds; the body slides up to meet it */}
        <h3 className="whitespace-pre-line font-display text-[1.25rem] font-medium leading-tight text-white transition-transform duration-500 ease-out group-hover:-translate-y-1">
          {title}
        </h3>
        <p className="mt-1.5 max-w-[94%] text-[12.5px] leading-snug text-white/75 transition-[transform,color] duration-500 ease-out group-hover:-translate-y-1 group-hover:text-white/90">
          {body}
        </p>
      </div>
    </motion.div>
  )
}
