import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { NAV } from '../lib/data'
import { useScrollLock, useScrolled } from '../lib/hooks'
import { EASE_OUT } from '../lib/motion'
import { MagneticButton } from './ui/Button'
import { Close, Leaf } from './ui/Icons'

function Wordmark({ onDark = false }: { onDark?: boolean }) {
  return (
    <a href="#home" className="group flex items-center gap-2" aria-label="Aeline home">
      <span
        className={`grid h-8 w-8 place-items-center rounded-[10px] transition-colors duration-200 ease-out ${
          onDark ? 'bg-lime text-bark' : 'bg-forest-deep text-lime'
        }`}
      >
        <Leaf className="h-[18px] w-[18px] transition-transform duration-500 ease-out group-hover:-rotate-12" />
      </span>
      <span
        className={`font-display text-[19px] font-semibold tracking-[-0.03em] ${
          onDark ? 'text-white' : 'text-ink'
        }`}
      >
        Aeline
      </span>
    </a>
  )
}

/** Link with an underline that wipes in from the left. */
function NavLink({ label, href }: { label: string; href: string }) {
  return (
    <a
      href={href}
      className="group relative py-1 text-[13.5px] font-medium text-ink-soft transition-colors duration-200 ease-out hover:text-ink"
    >
      {label}
      <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-ink transition-transform duration-300 ease-out group-hover:scale-x-100" />
    </a>
  )
}

export function Navbar() {
  const scrolled = useScrolled(40)
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()
  useScrollLock(open)

  return (
    <>
      <motion.header
        initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translate3d(0,-16px,0)' }}
        animate={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4"
      >
        <nav
          // Condense + frost once the hero starts scrolling under it
          className={[
            'mx-auto flex max-w-[1180px] items-center justify-between rounded-full px-4 py-2.5 sm:px-6',
            // Padding stays put — transitioning it would relayout the bar on
            // every frame. The condense reads through surface and shadow.
            'transition-[background-color,box-shadow,backdrop-filter] duration-300 ease-out',
            scrolled
              ? 'bg-white/80 shadow-[0_8px_30px_-12px_rgba(20,28,22,0.25)] backdrop-blur-xl'
              : 'bg-transparent shadow-none',
          ].join(' ')}
        >
          <Wordmark />

          <div className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <NavLink key={item.label} {...item} />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <MagneticButton
              variant="lime"
              href="#newsletter"
              className="hidden text-[13.5px] sm:inline-flex"
              strength={0.25}
            >
              Get Involved
            </MagneticButton>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
              className="pressable grid h-10 w-10 place-items-center rounded-full border border-ink/12 bg-white/70 lg:hidden"
            >
              <span className="flex flex-col gap-[5px]">
                <span className="block h-px w-4 bg-ink" />
                <span className="block h-px w-4 bg-ink" />
              </span>
            </button>
          </div>
        </nav>
      </motion.header>

      <MobileMenu open={open} onClose={() => setOpen(false)} />
    </>
  )
}

/* ------------------------------------------------------------------ *
 * Mobile menu. Full-bleed panel: it is not anchored to the trigger, so
 * it slides rather than scaling out of a point.
 * ------------------------------------------------------------------ */
function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[70] lg:hidden"
          initial="hidden"
          animate="show"
          exit="hidden"
        >
          {/* Backdrop is a click target only — it stays out of the a11y tree
              so it doesn't duplicate the close button's name. Keyboard users
              get Escape and the button itself. */}
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
            transition={{ duration: 0.3, ease: EASE_OUT }}
            className="absolute inset-0 bg-bark/40 backdrop-blur-[2px]"
          />

          <motion.div
            variants={
              reduce
                ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                : {
                    hidden: { transform: 'translate3d(0,-100%,0)' },
                    show: { transform: 'translate3d(0,0,0)' },
                  }
            }
            transition={{ duration: 0.5, ease: [0.32, 0.72, 0, 1] }}
            className="relative m-3 overflow-hidden rounded-3xl bg-surface p-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <Wordmark />
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="pressable grid h-10 w-10 place-items-center rounded-full border border-ink/12"
              >
                <Close className="h-4 w-4" />
              </button>
            </div>

            <motion.ul
              className="mt-6 flex flex-col"
              variants={{ show: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } } }}
            >
              {NAV.map((item) => (
                <motion.li
                  key={item.label}
                  variants={
                    reduce
                      ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                      : {
                          hidden: { opacity: 0, transform: 'translate3d(0,14px,0)' },
                          show: { opacity: 1, transform: 'translate3d(0,0,0)' },
                        }
                  }
                  transition={{ duration: 0.45, ease: EASE_OUT }}
                  className="border-b border-ink/8 last:border-0"
                >
                  <a
                    href={item.href}
                    onClick={onClose}
                    className="block py-3.5 font-display text-2xl tracking-[-0.03em] text-ink"
                  >
                    {item.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <MagneticButton
              variant="lime"
              href="#newsletter"
              onClick={onClose}
              className="mt-5 w-full"
              arrow
            >
              Get Involved
            </MagneticButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
