import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import { animate, useInView, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

/** SSR-safe layout effect (harmless here, but keeps the hooks portable). */
const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

/**
 * Smooth scroll. Disabled outright when the user prefers reduced motion —
 * hijacking the scroll is the single most disorienting thing on this page.
 */
export function useSmoothScroll() {
  const reduce = useReducedMotion()
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (reduce) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t: number) => 1 - Math.pow(1 - t, 3),
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      // Native momentum on touch beats anything we can simulate
      syncTouch: false,
    })
    lenisRef.current = lenis

    let frame = 0
    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }
    frame = requestAnimationFrame(raf)

    // Anchor links route through Lenis so they share the same easing
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]')
      if (!anchor) return
      const id = anchor.getAttribute('href')
      if (!id || id === '#') return
      const target = document.querySelector(id)
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target as HTMLElement, { offset: -90, duration: 1.2 })
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      cancelAnimationFrame(frame)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduce])

  return lenisRef
}

/** Lock the page while a modal or the mobile menu owns the screen. */
export function useScrollLock(locked: boolean) {
  useIsoLayoutEffect(() => {
    if (!locked) return
    const previous = document.body.style.overflow
    const scrollbar = window.innerWidth - document.documentElement.clientWidth
    document.body.style.overflow = 'hidden'
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`
    return () => {
      document.body.style.overflow = previous
      document.body.style.paddingRight = ''
    }
  }, [locked])
}

/**
 * Count up once the element is on screen. Reduced motion jumps to the final
 * value — the number is the information, the counting is the decoration.
 */
export function useCountUp(target: number, duration = 1.6) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  const reduce = useReducedMotion()
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setValue(target)
      return
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => setValue(v),
    })
    return () => controls.stop()
  }, [inView, target, duration, reduce])

  return { ref, value: Math.round(value) }
}

/**
 * Magnetic pull toward the pointer. Spring-driven because the user can whip
 * the cursor away mid-motion and it has to carry that velocity out.
 */
export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.6 })

  useEffect(() => {
    const el = ref.current
    if (!el || reduce) return
    // Touch devices fire synthetic hovers; magnetism there is noise
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
      y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
    }
    const onLeave = () => {
      x.set(0)
      y.set(0)
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [strength, reduce, x, y])

  return { ref, x: sx, y: sy }
}

/** True once the window has scrolled past `offset`. Drives the nav's condensed state. */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])
  return scrolled
}

/** Fine-pointer detection, kept reactive so plugging in a mouse works. */
export function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return fine
}
