import { useEffect } from 'react'
import { gsap } from 'gsap'

export default function useCursor() {
  useEffect(() => {
    const dot = document.getElementById('cursor-dot')
    const ring = document.getElementById('cursor-ring')
    if (!dot || !ring) return

    const xDot = gsap.quickTo(dot, 'x', { duration: 0.15, ease: 'power3.out' })
    const yDot = gsap.quickTo(dot, 'y', { duration: 0.15, ease: 'power3.out' })
    const xRing = gsap.quickTo(ring, 'x', { duration: 0.55, ease: 'power3.out' })
    const yRing = gsap.quickTo(ring, 'y', { duration: 0.55, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      xDot(e.clientX); yDot(e.clientY)
      xRing(e.clientX); yRing(e.clientY)
    }

    // Event delegation: one pair of listeners on window instead of attaching
    // to every a/button on mount. Covers elements that mount later too
    // (scroll-triggered cards, hover pills, etc.) with nothing to clean up
    // per-element.
    const onPointerOver = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('a, button, [data-hover]')
      if (target) ring.classList.add('hovered')
    }
    const onPointerOut = (e: PointerEvent) => {
      const target = (e.target as HTMLElement)?.closest?.('a, button, [data-hover]')
      const related = (e.relatedTarget as HTMLElement)?.closest?.('a, button, [data-hover]')
      if (target && target !== related) ring.classList.remove('hovered')
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('pointerover', onPointerOver)
    window.addEventListener('pointerout', onPointerOut)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('pointerover', onPointerOver)
      window.removeEventListener('pointerout', onPointerOut)
    }
  }, [])
}
