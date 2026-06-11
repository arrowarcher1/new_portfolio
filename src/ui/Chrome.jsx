import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { STOPS, PAGES, LINKS } from '../data/content'
import { scrollBus, jumpToStop } from '../lib/scrollBus'
import { FaGithub, FaLinkedin } from 'react-icons/fa'

// Fixed UI outside the canvas: wordmark, social shortcuts, journey rail,
// progress bar, and the intro veil.

export function IntroVeil() {
  const [gone, setGone] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setGone(true), 1500)
    return () => clearTimeout(t)
  }, [])
  return (
    <AnimatePresence>
      {!gone && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-void-950"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-6">
            <div className="loader-orb h-3 w-3 rounded-full bg-aurora-fuchsia shadow-[0_0_30px_#d946ef]" />
            <p className="font-mono text-[0.65rem] tracking-[0.4em] text-mist-300 uppercase">
              entering the void
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export function Wordmark() {
  return (
    <div className="fixed top-5 left-6 z-40 flex items-center gap-4">
      <button
        onClick={() => jumpToStop(0, PAGES)}
        className="font-display font-semibold text-sm tracking-widest text-mist-100 hover:text-aurora-fuchsia transition-colors"
      >
        AVO<span className="text-aurora-fuchsia">.</span>
      </button>
    </div>
  )
}

export function TopRight() {
  return (
    <div className="fixed top-5 right-6 z-40 flex items-center gap-4 text-mist-300">
      <a
        href={LINKS.github}
        target="_blank"
        rel="noreferrer"
        aria-label="GitHub"
        className="hover:text-aurora-fuchsia transition-colors"
      >
        <FaGithub size={17} />
      </a>
      <a
        href={LINKS.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
        className="hover:text-aurora-fuchsia transition-colors"
      >
        <FaLinkedin size={17} />
      </a>
      <a href={LINKS.resume} download className="ghost-button !py-1.5 !px-3.5 !text-[0.65rem]">
        Resume
      </a>
    </div>
  )
}

export function JourneyRail() {
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setProgress(scrollBus.offset)
      setActive(Math.round(scrollBus.offset * (PAGES - 1)))
    }, 120)
    return () => clearInterval(id)
  }, [])

  return (
    <>
      {/* Progress filament */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-40 bg-void-700/60">
        <div
          className="h-full bg-gradient-to-r from-aurora-fuchsia via-aurora-violet to-aurora-cyan transition-[width] duration-200"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      {/* Stop rail */}
      <nav
        aria-label="Journey stops"
        className="fixed right-5 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3"
      >
        {STOPS.map((stop, i) => (
          <button
            key={stop.id}
            onClick={() => jumpToStop(i, PAGES)}
            className="group flex items-center justify-end gap-2"
            aria-label={`Go to ${stop.label}`}
          >
            <span
              className={`font-mono text-[0.6rem] tracking-[0.2em] uppercase transition-all duration-300 ${
                active === i
                  ? 'text-aurora-fuchsia opacity-100'
                  : 'text-mist-300 opacity-0 group-hover:opacity-80'
              }`}
            >
              {stop.label}
            </span>
            <span
              className={`rounded-full transition-all duration-300 ${
                active === i
                  ? 'h-2.5 w-2.5 bg-aurora-fuchsia shadow-[0_0_12px_#d946ef]'
                  : 'h-1.5 w-1.5 bg-mist-400/50 group-hover:bg-mist-200'
              }`}
            />
          </button>
        ))}
      </nav>
    </>
  )
}
