import { useEffect, useRef } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { IMG } from '../lib/data'
import { EASE_OUT } from '../lib/motion'
import { useScrollLock } from '../lib/hooks'
import { Img } from './ui/Img'
import { Close } from './ui/Icons'

export function VideoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion()
  const closeRef = useRef<HTMLButtonElement>(null)
  const restoreRef = useRef<HTMLElement | null>(null)
  useScrollLock(open)

  useEffect(() => {
    if (!open) {
      restoreRef.current?.focus?.()
      return
    }
    restoreRef.current = document.activeElement as HTMLElement
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Our story"
          className="fixed inset-0 z-[100] grid place-items-center p-4"
        >
          {/* Backdrop shares the panel's timing so they read as one surface.
              Click target only — Escape and the close button serve keyboard. */}
          <motion.div
            aria-hidden="true"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="absolute inset-0 bg-bark/70 backdrop-blur-md"
          />

          <motion.div
            // Centered, so transform-origin stays center — it is not
            // anchored to the trigger the way a popover would be.
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.96)' }}
            animate={{ opacity: 1, transform: 'scale(1)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'scale(0.96)' }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-[1.5rem] bg-bark shadow-2xl"
          >
            <div className="animate-drift absolute inset-0">
              <Img id={IMG.beams} alt="" width={1600} priority />
            </div>
            <span className="absolute inset-0 bg-gradient-to-t from-bark/90 via-bark/25 to-bark/40" />

            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-lime">
                Our Story
              </p>
              <h2 className="mt-3 max-w-xl font-display text-[clamp(1.5rem,4vw,2.5rem)] font-medium leading-tight text-white">
                Fifteen thousand people, one shared horizon.
              </h2>
              <p className="mt-3 max-w-md text-[13px] leading-relaxed text-white/70">
                A short film about the communities restoring the land they live on — coming soon.
              </p>

              {/* Placeholder scrubber. linear: it is progress, and progress
                  should never ease. */}
              <div className="mt-6 h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                <motion.span
                  initial={{ transform: 'scaleX(0)' }}
                  animate={{ transform: 'scaleX(1)' }}
                  transition={{ duration: 12, ease: 'linear' }}
                  className="block h-full w-full origin-left bg-lime"
                />
              </div>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="pressable absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors duration-200 ease-out hover:bg-white/30"
            >
              <Close className="h-4 w-4" />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
