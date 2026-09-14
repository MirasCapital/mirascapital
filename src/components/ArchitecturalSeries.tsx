"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { motion, useReducedMotion } from "motion/react"

const images = [
  {
    src: "/miras-architecture-opera-v2.webp",
    alt: "Illuminated tiled sail rising against a deep navy sky",
  },
  {
    src: "/miras-architecture-steel-v2.webp",
    alt: "Riveted steel bridge structure illuminated at blue hour",
  },
  {
    src: "/miras-architecture-stone-v2.webp",
    alt: "Sandstone and dark glass architectural geometry at blue hour",
  },
  {
    src: "/miras-architecture-cables-v2.webp",
    alt: "Concrete bridge pylon and cable geometry at blue hour",
  },
]

export function ArchitecturalSeries() {
  const reduce = useReducedMotion()
  const [active, setActive] = useState(0)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [controlFocused, setControlFocused] = useState(false)
  const shouldPause = Boolean(reduce || paused || hovered || controlFocused)

  useEffect(() => {
    if (shouldPause) return

    const interval = window.setInterval(() => {
      setActive((current) => (current + 1) % images.length)
    }, 5500)

    return () => window.clearInterval(interval)
  }, [shouldPause])

  return (
    <div
      className="absolute inset-0"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {images.map((image, index) => {
        const isActive = index === active

        return (
          <motion.div
            key={image.src}
            aria-hidden={!isActive}
            initial={false}
            animate={
              isActive
                ? { opacity: 1, clipPath: "inset(0% 0% 0% 0%)" }
                : { opacity: 0, clipPath: "inset(0% 0% 100% 0%)" }
            }
            transition={reduce ? { duration: 0 } : { duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={image.src}
              alt={isActive ? image.alt : ""}
              fill
              priority={index === 0}
              sizes="(min-width: 1536px) 720px, (min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </motion.div>
        )
      })}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(5,8,11,0.58)_100%)]" />
      {!reduce && (
        <button
          type="button"
          aria-label={paused ? "Resume image rotation" : "Pause image rotation"}
          aria-pressed={paused}
          onClick={() => setPaused((current) => !current)}
          onFocus={() => setControlFocused(true)}
          onBlur={() => setControlFocused(false)}
          className="absolute bottom-3 right-3 min-h-11 px-3 text-[0.62rem] font-semibold uppercase tracking-[0.14em] text-cloud/62 transition-colors duration-200 hover:text-cloud focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cloud/60 sm:bottom-5 sm:right-5"
        >
          {paused ? "Play" : "Pause"}
        </button>
      )}
    </div>
  )
}
