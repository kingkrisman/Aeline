import { useState } from 'react'
import { useScroll, useSpring } from 'motion/react'
import { useSmoothScroll } from './lib/hooks'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { Mission } from './components/Mission'
import { TrustedBy } from './components/TrustedBy'
import { Initiatives } from './components/Initiatives'
import { Footer } from './components/Footer'
import { VideoModal } from './components/VideoModal'
import { Cursor, ScrollProgress } from './components/ui/Cursor'

export default function App() {
  useSmoothScroll()
  const [videoOpen, setVideoOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  // Smoothing the indicator keeps it from jittering with Lenis's sub-pixel steps
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 })

  return (
    <>
      <ScrollProgress progress={progress} />
      <Cursor />

      <a
        href="#mission"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-bark focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <Navbar />

      <main className="pb-2">
        <Hero onPlay={() => setVideoOpen(true)} />
        <Mission />
        <TrustedBy />
        <Initiatives />
        <Footer />
      </main>

      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  )
}
