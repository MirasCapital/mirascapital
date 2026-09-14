"use client"

import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useCallback, useRef, useState } from "react"

const SUNSET_SEQUENCE_DESKTOP = "/harbour-animation/harbour-sunset-transition-v3.mp4"
const SUNSET_SEQUENCE_MOBILE = "/harbour-animation/harbour-sunset-transition-mobile-v3.mp4"
const EVENING_LOOP_DESKTOP = "/harbour-animation/harbour-evening-loop-v3.mp4"
const EVENING_LOOP_MOBILE = "/harbour-animation/harbour-evening-loop-mobile-v3.mp4"
const SUNSET_POSTER_DESKTOP = "/miras-hero-sunset-v2.webp"
const SUNSET_POSTER_MOBILE = "/miras-hero-sunset-mobile-v2.webp"
const EVENING_POSTER_DESKTOP = "/miras-hero-evening-v2.webp"
const EVENING_POSTER_MOBILE = "/miras-hero-evening-mobile-v2.webp"

type ScenePhase = "sunset" | "evening"

export function ImmersiveBackground() {
  const eveningVideoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll()
  const reduce = useReducedMotion()
  const [phase, setPhase] = useState<ScenePhase>("sunset")
  const [animationFailed, setAnimationFailed] = useState(false)
  const sceneOpacity = useTransform(scrollYProgress, [0, 0.14, 0.22], [1, 0.92, 0])

  const handleSequenceEnded = useCallback(() => setPhase("evening"), [])

  return (
    <motion.div
      aria-hidden
      style={{ opacity: sceneOpacity }}
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07111c]"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0">
          <Image
            src={phase === "sunset" ? SUNSET_POSTER_MOBILE : EVENING_POSTER_MOBILE}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center md:hidden"
          />
          <Image
            src={phase === "sunset" ? SUNSET_POSTER_DESKTOP : EVENING_POSTER_DESKTOP}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hidden object-cover object-center md:block"
          />
          {reduce || animationFailed ? null : (
            <>
              <video
                ref={eveningVideoRef}
                muted
                loop
                playsInline
                preload="metadata"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1600ms] ease-in-out ${phase === "evening" ? "opacity-100" : "opacity-0"}`}
                onError={() => setAnimationFailed(true)}
              >
                <source media="(max-width: 767px)" src={EVENING_LOOP_MOBILE} type="video/mp4" />
                <source src={EVENING_LOOP_DESKTOP} type="video/mp4" />
              </video>
              <video
                autoPlay
                muted
                playsInline
                preload="auto"
                className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-[1600ms] ease-in-out ${phase === "sunset" ? "opacity-100" : "opacity-0"}`}
                onTimeUpdate={(event) => {
                  const video = event.currentTarget

                  if (phase === "sunset" && video.duration - video.currentTime <= 1.6) {
                    const eveningVideo = eveningVideoRef.current

                    if (eveningVideo) {
                      eveningVideo.currentTime = 0
                      void eveningVideo.play()
                    }

                    setPhase("evening")
                  }
                }}
                onEnded={handleSequenceEnded}
                onError={() => setAnimationFailed(true)}
              >
                <source media="(max-width: 767px)" src={SUNSET_SEQUENCE_MOBILE} type="video/mp4" />
                <source src={SUNSET_SEQUENCE_DESKTOP} type="video/mp4" />
              </video>
            </>
          )}
        </div>
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,10,19,0.2)_0%,rgba(2,10,19,0.06)_38%,rgba(2,10,19,0.5)_100%),radial-gradient(ellipse_at_52%_42%,transparent_34%,rgba(0,8,17,0.28)_100%)]" />
    </motion.div>
  )
}
