"use client"

import { useEffect, useRef } from "react"
import { motion, useReducedMotion } from "motion/react"

export type Deal = {
  logo: string
  alt: string
  type: string
  counter?: string
  counterAlt?: string
  year: string
}

function Tombstone({ deal }: { deal: Deal }) {
  return (
    <article className="flex h-full min-h-[360px] flex-col bg-cloud p-7 text-ink shadow-[0_22px_60px_rgba(0,10,20,0.18)] ring-1 ring-inset ring-ink/10 sm:min-h-[430px] sm:p-10 lg:min-h-[470px] lg:p-12">
      <div className="flex flex-1 flex-col items-center justify-center gap-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={deal.logo}
          alt={deal.alt}
          draggable={false}
          className="h-20 w-auto max-w-[185px] object-contain mix-blend-multiply sm:h-28 sm:max-w-[280px] min-[1600px]:max-w-[220px]"
        />
        <span className="max-w-[24ch] text-center font-serif text-[1.15rem] italic leading-snug text-ink/58 sm:text-[1.3rem]">
          {deal.type}
        </span>
        {deal.counter && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={deal.counter}
            alt={deal.counterAlt ?? ""}
            draggable={false}
            className="h-16 w-auto max-w-[175px] object-contain mix-blend-multiply sm:h-24 sm:max-w-[250px] min-[1600px]:max-w-[190px]"
          />
        )}
      </div>
      <div className="mt-8 flex items-center justify-center border-t border-ink/10 pt-6">
        <span className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-ink/45">
          {deal.year}
        </span>
      </div>
    </article>
  )
}

function MobileCarousel({ transactions }: { transactions: Deal[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const mouseDrag = useRef({ active: false, pointerId: -1, startX: 0, scrollLeft: 0 })
  const loop = [...transactions, ...transactions, ...transactions]

  useEffect(() => {
    const element = ref.current
    if (!element) return
    let block = element.scrollWidth / 3
    let locked = false

    const recenter = () => {
      const middleCard = element.children[transactions.length] as HTMLElement | undefined
      const nextCycleCard = element.children[transactions.length * 2] as HTMLElement | undefined
      if (!middleCard || !nextCycleCard) return
      block = nextCycleCard.offsetLeft - middleCard.offsetLeft
      if (block <= 0) return
      const inlineInset = Number.parseFloat(getComputedStyle(element).paddingInlineStart) || 0
      locked = true
      element.scrollLeft = middleCard.offsetLeft - inlineInset * 2
      requestAnimationFrame(() => { locked = false })
    }
    recenter()

    let raf = 0
    const onScroll = () => {
      if (locked) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const x = element.scrollLeft
        if (x < block * 0.5) element.scrollLeft = x + block
        else if (x > block * 2.5) element.scrollLeft = x - block
      })
    }

    element.addEventListener("scroll", onScroll, { passive: true })
    const observer = new ResizeObserver(recenter)
    observer.observe(element)
    return () => {
      element.removeEventListener("scroll", onScroll)
      observer.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [transactions.length])

  const startMouseDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || event.button !== 0 || !ref.current) return
    mouseDrag.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: ref.current.scrollLeft,
    }
    ref.current.setPointerCapture(event.pointerId)
  }

  const moveMouseDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = mouseDrag.current
    if (!drag.active || drag.pointerId !== event.pointerId || !ref.current) return
    event.preventDefault()
    ref.current.scrollLeft = drag.scrollLeft - (event.clientX - drag.startX)
  }

  const endMouseDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!mouseDrag.current.active || mouseDrag.current.pointerId !== event.pointerId) return
    mouseDrag.current.active = false
    if (ref.current?.hasPointerCapture(event.pointerId)) {
      ref.current.releasePointerCapture(event.pointerId)
    }
  }

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Recent transactions. Swipe or drag horizontally to explore."
      onPointerDown={startMouseDrag}
      onPointerMove={moveMouseDrag}
      onPointerUp={endMouseDrag}
      onPointerCancel={endMouseDrag}
      onDragStart={(event) => event.preventDefault()}
      className="flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 select-none active:cursor-grabbing [scrollbar-width:none] [-webkit-overflow-scrolling:touch] sm:hidden [&::-webkit-scrollbar]:hidden"
    >
      {loop.map((deal, index) => (
        <div key={`${deal.alt}-${index}`} className="w-[78vw] max-w-[310px] shrink-0 snap-start snap-always">
          <Tombstone deal={deal} />
        </div>
      ))}
    </div>
  )
}

export function TransactionCards({ transactions }: { transactions: Deal[] }) {
  const reduce = useReducedMotion()

  return (
    <div className="mt-16 lg:mt-24">
      <MobileCarousel transactions={transactions} />
      <div className="tombstone-grid mx-auto hidden max-w-[920px] gap-6 sm:grid sm:grid-cols-2 lg:gap-8">
        {transactions.map((deal, index) => (
          <motion.div
            key={deal.alt}
            className="w-full"
            initial={{ opacity: 0, transform: "translateY(18px)" }}
            whileInView={{ opacity: 1, transform: "translateY(0px)" }}
            viewport={{ once: true, amount: 0.3 }}
            transition={reduce ? { duration: 0 } : { duration: 0.55, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
          >
            <Tombstone deal={deal} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}
