import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

let inst: Lenis | null = null
export function getLenis() { return inst }

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.6, easing: (t:number) => Math.min(1, 1.001 - Math.pow(2, -10*t)), smoothWheel: true, wheelMultiplier: 0.75 })
    inst = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)
    return () => { gsap.ticker.remove(tick); lenis.destroy(); inst = null }
  }, [])
}
