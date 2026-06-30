import { useState } from 'react'
import useLenis from './hooks/useLenis'
import useCursor from './hooks/useCursor'
import { getLenis } from './hooks/useLenis'
import BubbleMenu from './components/BubbleMenu'
import HeroSection from './sections/HeroSection'
import MarqueeSection from './sections/MarqueeSection'
import WorkSection from './sections/WorkSection'
import ExperienceSection from './sections/ExperienceSection'
import ContactSection from './sections/ContactSection'

function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  const lenis = getLenis()
  const offset = 96
  if (lenis) lenis.scrollTo(el, { duration: 1.8, offset: -offset })
  else {
    const y = el.getBoundingClientRect().top + window.scrollY - offset
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const NAV_ITEMS = [
  { label: 'home', href: '#top', ariaLabel: 'Home', rotation: -8, hoverStyles: { bgColor: '#2D5BFF', textColor: '#ffffff' }, onClick: () => scrollToId('top') },
  { label: 'work', href: '#work', ariaLabel: 'Work', rotation: 8, hoverStyles: { bgColor: '#00966B', textColor: '#ffffff' }, onClick: () => scrollToId('work') },
  { label: 'experience', href: '#experience', ariaLabel: 'Experience', rotation: 8, hoverStyles: { bgColor: '#7B4DD6', textColor: '#ffffff' }, onClick: () => scrollToId('experience') },
  { label: 'contact', href: '#contact', ariaLabel: 'Contact', rotation: -8, hoverStyles: { bgColor: '#FF5A36', textColor: '#ffffff' }, onClick: () => scrollToId('contact') },
]

export default function App() {
  const [navVisible, setNavVisible] = useState(false)
  useLenis()
  useCursor()

  return (
    <div style={{ fontFamily:'"Space Mono", monospace', background:'var(--paper)' }}>
      <div className="noise" />
      <div style={{ opacity: navVisible ? 1 : 0, transition: 'opacity 0.7s ease' }}>
        <BubbleMenu
          items={NAV_ITEMS}
          menuBg="#ffffff"
          menuContentColor="#15161A"
          logo={<span style={{ fontFamily:'"Space Mono",monospace', fontSize:13, color:'var(--ink)', letterSpacing:'-0.02em', fontWeight:700 }}>M Baqir</span>}
        />
      </div>
      <HeroSection onReady={() => setNavVisible(true)} />
      <MarqueeSection />
      <WorkSection />
      <ExperienceSection />
      <ContactSection />
    </div>
  )
}
