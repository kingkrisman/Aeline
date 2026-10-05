import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { AVATARS } from '../lib/data'
import { EASE_OUT } from '../lib/motion'
import { Reveal } from './ui/Reveal'
import { Check, Leaf } from './ui/Icons'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const reduce = useReducedMotion()

  return (
    <Reveal delay={0.3} as="div">
      <div
        id="newsletter"
        className="relative overflow-hidden rounded-[1.4rem] bg-lime p-5 lg:p-6"
      >
        {/* Slow light sweep across the panel. Purely atmospheric, and it
            stops entirely under reduced motion. */}
        <span
          aria-hidden="true"
          className="animate-drift pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/25 blur-2xl"
        />

        <h3 className="relative font-display text-[1.35rem] font-semibold leading-tight text-bark">
          Stay Inspired. Stay Informed.
        </h3>
        <p className="relative mt-2 max-w-[290px] text-[12.5px] leading-relaxed text-bark/70">
          Subscribe to our newsletter and get the latest updates on our projects, stories, and how
          you can help.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (!email.trim()) return
            setSent(true)
          }}
          className="relative mt-4 flex items-center gap-1.5 rounded-full bg-white/70 p-1.5 transition-colors duration-200 ease-out focus-within:bg-white"
        >
          <input
            type="email"
            required
            value={email}
            disabled={sent}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            aria-label="Email address for newsletter"
            className="min-w-0 flex-1 bg-transparent px-3.5 text-[13px] text-bark outline-none placeholder:text-bark/45 disabled:opacity-60"
          />
          <button
            type="submit"
            className="pressable relative shrink-0 overflow-hidden rounded-full bg-moss px-4 py-2 text-[12.5px] font-medium text-white transition-colors duration-200 ease-out hover:bg-moss-dark"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={sent ? 'sent' : 'idle'}
                initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0,8px,0)' }}
                animate={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0,-8px,0)' }}
                transition={{ duration: 0.22, ease: EASE_OUT }}
                className="flex items-center gap-1.5"
              >
                {sent ? (
                  <>
                    Subscribed <Check className="h-3.5 w-3.5" />
                  </>
                ) : (
                  'Subscribe'
                )}
              </motion.span>
            </AnimatePresence>
          </button>
        </form>

        <div className="relative mt-4 flex items-center gap-2.5">
          <div className="flex">
            {AVATARS.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                loading="lazy"
                className="-ml-2.5 h-7 w-7 rounded-full border-2 border-lime object-cover first:ml-0"
              />
            ))}
          </div>
          <p className="flex items-center gap-1.5 text-[11.5px] text-bark/70">
            <Leaf className="h-3.5 w-3.5 text-moss" />
            Join thousands of change-makers
          </p>
        </div>
      </div>
    </Reveal>
  )
}
