import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitChars, splitWords } from '../utils/splitText'

gsap.registerPlugin(ScrollTrigger)

const ROLES = ['Builder.', 'Engineer.', 'Problem Solver.', 'Team Lead.']

const TECH_MARQUEE = [
  'React', 'TypeScript', 'Node.js', 'GSAP', 'PostgreSQL', 'Apps Script', 'Tailwind', 'MongoDB',
]

export default function HeroSection({ onReady }: { onReady: () => void }) {
  const secRef = useRef<HTMLElement>(null)
  const tagRef = useRef<HTMLParagraphElement>(null)
  const h1aRef = useRef<HTMLHeadingElement>(null)
  const roleWrapRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const statusRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const scrollIndicRef = useRef<HTMLDivElement>(null)
  const bgTextRef = useRef<HTMLDivElement>(null)
  const cardsColRef = useRef<HTMLDivElement>(null)
  const cardARef = useRef<HTMLDivElement>(null)
  const cardBRef = useRef<HTMLDivElement>(null)
  const cardCRef = useRef<HTMLDivElement>(null)
  const marqueeWrapRef = useRef<HTMLDivElement>(null)
  const shapeARef = useRef<HTMLDivElement>(null)
  const shapeBRef = useRef<HTMLDivElement>(null)
  const shapeCRef = useRef<HTMLDivElement>(null)
  const statNumRefs = useRef<(HTMLDivElement | null)[]>([])

  const [roleIndex, setRoleIndex] = useState(0)

  const STATS = [
    { value: 50, suffix: '+', label: 'Projects Shipped', color: 'var(--signal)', bg: 'rgba(45,91,255,0.08)', border: 'rgba(45,91,255,0.18)' },
    { value: 3, suffix: '+', label: 'Years Building', color: 'var(--mint)', bg: 'rgba(0,150,107,0.08)', border: 'rgba(0,150,107,0.18)' },
    { value: 5, suffix: '', label: 'Org Tools Built', color: 'var(--violet)', bg: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.18)' },
  ]

  // Intro timeline + ambient motion + scroll parallax.
  useEffect(() => {
    gsap.set(secRef.current, { opacity: 0 })

    const tl = gsap.timeline({ delay: 0.3, onComplete: onReady })
    tl.to(secRef.current, { opacity: 1, duration: 0.01 })

    tl.fromTo(statusRef.current, { y: -16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, 0.1)
    tl.fromTo(bgTextRef.current, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.5, ease: 'power3.out' }, 0.05)
    tl.fromTo(tagRef.current, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power3.out' }, 0.18)

    if (h1aRef.current) {
      const chars = splitChars(h1aRef.current)
      tl.fromTo(chars, { y: '115%', rotateZ: 5 }, { y: '0%', rotateZ: 0, duration: 1.0, stagger: 0.03, ease: 'power4.out' }, 0.28)
    }

    tl.fromTo(roleWrapRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' }, 0.55)

    if (subRef.current) {
      const words = splitWords(subRef.current)
      tl.fromTo(words, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.8, stagger: 0.035 }, 0.7)
    }

    tl.fromTo(ctaRef.current, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)' }, 0.95)
    tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'power3.inOut', transformOrigin: 'left' }, 0.5)
    tl.fromTo(scrollIndicRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.7 }, 1.05)
    tl.fromTo(marqueeWrapRef.current, { opacity: 0 }, { opacity: 1, duration: 0.7 }, 1.0)

    // Staggered card stack reveal, with a count-up wired to the same beat.
    const cards = [cardARef.current, cardBRef.current, cardCRef.current]
    tl.fromTo(
      cards,
      { opacity: 0, y: 36, rotateX: -8 },
      {
        opacity: 1,
        y: 0,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.14,
        ease: 'power3.out',
        onStart: () => {
          STATS.forEach((stat, i) => {
            const el = statNumRefs.current[i]
            if (!el) return
            const counter = { val: 0 }
            gsap.to(counter, {
              val: stat.value,
              duration: 1.2,
              ease: 'power2.out',
              delay: 0.2 + i * 0.12,
              onUpdate: () => {
                el.textContent = `${Math.round(counter.val)}${stat.suffix}`
              },
            })
          })
        },
      },
      0.8
    )

    // Ambient floating shapes — slow, continuous, independent of scroll.
    gsap.to(shapeARef.current, { y: -20, x: 10, rotate: 14, duration: 6.4, ease: 'sine.inOut', yoyo: true, repeat: -1 })
    gsap.to(shapeBRef.current, { y: 16, x: -12, rotate: -12, duration: 7.8, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.3 })
    gsap.to(shapeCRef.current, { y: -12, x: -8, rotate: 9, duration: 5.6, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 0.6 })

    const bounceTween = gsap.to(scrollIndicRef.current, { y: 6, duration: 1.1, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.2 })

    const parallaxTrigger = ScrollTrigger.create({
      trigger: secRef.current,
      start: 'top top',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        gsap.set(bgTextRef.current, { y: p * 120, opacity: 1 - p * 1.5 })
        gsap.set(h1aRef.current, { y: p * 70 })
        gsap.set(roleWrapRef.current, { y: p * 50 })
        gsap.set(subRef.current, { y: p * 40, opacity: 1 - p * 2 })
        gsap.set(cardsColRef.current, { y: -p * 60 })
        gsap.set([shapeARef.current, shapeBRef.current, shapeCRef.current], { opacity: 1 - p * 1.6 })
      },
    })

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window
      const nx = (e.clientX / innerWidth - 0.5) * 2
      const ny = (e.clientY / innerHeight - 0.5) * 2
      gsap.to(bgTextRef.current, { x: nx * 16, duration: 1.2, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(shapeARef.current, { x: `+=${nx * 0.4}`, duration: 1.4, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(shapeBRef.current, { x: `+=${-nx * 0.5}`, y: `+=${ny * 0.3}`, duration: 1.6, ease: 'power3.out', overwrite: 'auto' })
      gsap.to(cardsColRef.current, { rotateY: nx * 3, rotateX: -ny * 3, duration: 1, ease: 'power3.out', overwrite: 'auto' })
    }
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      tl.kill()
      bounceTween.kill()
      parallaxTrigger.kill()
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  // Cycling role text — flips out the old word, flips in the new one.
  useEffect(() => {
    const interval = setInterval(() => {
      if (!roleRef.current) return
      gsap.to(roleRef.current, {
        y: -28,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in',
        onComplete: () => {
          setRoleIndex((prev) => (prev + 1) % ROLES.length)
          gsap.fromTo(roleRef.current, { y: 28, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' })
        },
      })
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  const handleCtaMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const relX = e.clientX - rect.left - rect.width / 2
    const relY = e.clientY - rect.top - rect.height / 2
    gsap.to(el, { x: relX * 0.3, y: relY * 0.4, duration: 0.4, ease: 'power2.out' })
  }
  const handleCtaMouseLeave = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { x: 0, y: 0, scale: 1, duration: 0.6, ease: 'elastic.out(1,0.4)' })
  }
  const handleCtaMouseEnter = (e: React.MouseEvent<HTMLAnchorElement>) => {
    gsap.to(e.currentTarget, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
  }

  // Per-card tilt, independent of the whole-column parallax tilt above.
  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    gsap.to(el, { rotateY: px * 10, rotateX: -py * 10, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
  }
  const handleCardMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    gsap.to(e.currentTarget, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'power3.out' })
  }

  const dotGridStyle: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: 'radial-gradient(rgba(21,22,26,0.10) 1px, transparent 1px)',
    backgroundSize: '28px 28px',
    maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 40%, transparent 100%)',
  }

  const accentLine = (top: string): React.CSSProperties => ({
    position: 'absolute',
    left: 0,
    right: 0,
    top,
    height: 1,
    background: 'linear-gradient(90deg, transparent, rgba(45,91,255,0.18) 30%, rgba(45,91,255,0.28) 50%, rgba(45,91,255,0.18) 70%, transparent)',
    pointerEvents: 'none',
  })

  const cardBase: React.CSSProperties = {
    padding: 'clamp(1.1rem,2.2vw,1.6rem)',
    borderRadius: 16,
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  }

  return (
    <section ref={secRef} id="top" style={{ position: 'relative', zIndex: 2, minHeight: '100svh', display: 'flex', flexDirection: 'column', background: 'var(--paper)', overflow: 'hidden', opacity: 0, padding: 'clamp(1rem, 3vw, 2rem) 0' }}>
      <div style={{ ...dotGridStyle, zIndex: 2 }} />
      <div style={{ ...accentLine('18%'), zIndex: 2 }} />
      <div style={{ ...accentLine('72%'), zIndex: 2 }} />

      {/* Floating decorative shapes */}
      <div ref={shapeARef} style={{ position: 'absolute', top: '12%', right: '6%', width: 'clamp(40px,6vw,72px)', height: 'clamp(40px,6vw,72px)', border: '1.5px solid rgba(45,91,255,0.22)', borderRadius: '28% 72% 65% 35% / 45% 35% 65% 55%', zIndex: 1, pointerEvents: 'none' }} />
      <div ref={shapeBRef} style={{ position: 'absolute', bottom: '30%', left: '5%', width: 'clamp(10px,1.6vw,16px)', height: 'clamp(10px,1.6vw,16px)', background: 'var(--mint)', borderRadius: '50%', opacity: 0.5, zIndex: 1, pointerEvents: 'none' }} />
      <div ref={shapeCRef} style={{ position: 'absolute', top: '40%', left: '46%', width: 'clamp(22px,3.4vw,38px)', height: 'clamp(22px,3.4vw,38px)', border: '1.5px solid rgba(168,85,247,0.2)', transform: 'rotate(45deg)', zIndex: 1, pointerEvents: 'none' }} />

      {/* Status */}
      <div ref={statusRef} style={{ position: 'absolute', top: 'clamp(2rem,6vw,3rem)', left: 'clamp(1.25rem,4vw,4rem)', zIndex: 10, display: 'flex', alignItems: 'center', gap: 8, opacity: 0 }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--mint)', boxShadow: '0 0 12px rgba(0,150,107,0.5)', display: 'block', animation: 'blink 2s ease-in-out infinite' }} />
        <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 'clamp(0.5rem,2vw,0.65rem)', color: 'var(--ink-soft)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          Available · Mumbai, India
        </span>
      </div>

      {/* Watermark */}
      <div ref={bgTextRef} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 0, pointerEvents: 'none', opacity: 0, whiteSpace: 'nowrap' }}>
        <span style={{
          fontFamily: '"Space Mono",monospace',
          fontWeight: 700,
          fontSize: 'clamp(50px,16vw,240px)',
          letterSpacing: '-0.06em',
          lineHeight: 1,
          background: 'radial-gradient(ellipse at center, rgba(45,91,255,0.08) 0%, rgba(45,91,255,0.01) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          color: 'transparent',
          userSelect: 'none',
        }}>
          BUILDER
        </span>
      </div>

      {/* Main content — asymmetric two-column layout */}
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(2rem,6vw,4rem) clamp(1.25rem,4vw,4rem)' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0,1.3fr) minmax(0,0.9fr)',
            gap: 'clamp(2rem,5vw,3.5rem)',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          {/* Left — name, role, copy, CTA */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.9rem,2.4vw,1.3rem)', alignItems: 'flex-start' }}>
            <p ref={tagRef} style={{ fontFamily: '"Space Mono",monospace', fontSize: 'clamp(0.5rem,1.6vw,0.65rem)', color: 'var(--signal)', textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0, fontWeight: 700 }}>
              B.Tech AI &amp; DS · KJSCE · Batch '28
            </p>

            <div style={{ overflow: 'hidden', maxWidth: '100%' }}>
              <h1 ref={h1aRef} style={{ fontFamily: '"Space Mono",monospace', fontWeight: 400, fontSize: 'clamp(2.2rem,7vw,7.5rem)', letterSpacing: '-0.04em', lineHeight: 0.92, color: 'var(--ink)', margin: 0 }}>
                M Baqir.
              </h1>
            </div>

            {/* Cycling role line */}
            <div ref={roleWrapRef} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden', opacity: 0 }}>
              <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 'clamp(1.1rem,3.2vw,2.4rem)', color: 'var(--ink-faint)', fontWeight: 400 }}>I build as a</span>
              <span style={{ display: 'inline-block', overflow: 'hidden', height: 'clamp(1.5rem,4vw,3rem)', verticalAlign: 'bottom' }}>
                <span
                  ref={roleRef}
                  style={{
                    display: 'inline-block',
                    fontFamily: '"Space Mono",monospace',
                    fontSize: 'clamp(1.1rem,3.2vw,2.4rem)',
                    fontWeight: 700,
                    color: 'var(--signal)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {ROLES[roleIndex]}
                </span>
              </span>
            </div>

            <p ref={subRef} style={{ fontFamily: '"Space Grotesk",sans-serif', fontWeight: 400, fontSize: 'clamp(0.85rem,1.5vw,1.1rem)', color: 'var(--ink-soft)', lineHeight: 1.65, margin: 0, maxWidth: '38rem' }}>
              I ship products that run in production, not just side projects. Full-stack web development, automation, and scalable solutions — built for real teams, not portfolios.
            </p>

            <a
              ref={ctaRef}
              href="#contact"
              style={{ fontFamily: '"Space Mono",monospace', fontSize: 'clamp(0.55rem,1.2vw,0.7rem)', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#fff', background: 'var(--signal)', padding: 'clamp(0.7rem,1.6vw,0.95rem) clamp(1.4rem,2.4vw,2rem)', borderRadius: 9999, textDecoration: 'none', opacity: 0, display: 'inline-flex', alignItems: 'center', gap: '0.5rem', boxShadow: '0 4px 14px rgba(45,91,255,0.28)', border: 'none', cursor: 'pointer', marginTop: '0.4rem' }}
              onMouseMove={handleCtaMouseMove}
              onMouseEnter={handleCtaMouseEnter}
              onMouseLeave={handleCtaMouseLeave}
            >
              Say hello ↗
            </a>
          </div>

          {/* Right — floating stacked info cards */}
          <div ref={cardsColRef} style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(0.85rem,2vw,1.1rem)', perspective: 800, width: '100%' }}>
            <div
              ref={cardARef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ ...cardBase, background: '#fff', border: '1px solid var(--line)', boxShadow: '0 12px 32px rgba(21,22,26,0.06)' }}
            >
              <div style={{ fontFamily: '"Space Mono",monospace', fontSize: '0.6rem', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.7rem' }}>
                Currently
              </div>
              <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(0.85rem,1.4vw,1rem)', color: 'var(--ink)', lineHeight: 1.5 }}>
                Tech Head at <span style={{ color: 'var(--signal)', fontWeight: 600 }}>KJSCE Alumni Cell</span> — built the org's tech function from scratch.
              </div>
            </div>

            <div
              ref={cardBRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ ...cardBase, background: '#fff', border: '1px solid var(--line)', boxShadow: '0 12px 32px rgba(21,22,26,0.06)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}
            >
              {STATS.map((stat, i) => (
                <div key={stat.label} style={{ padding: 'clamp(0.7rem,1.4vw,0.95rem)', background: stat.bg, borderRadius: 10, border: `1px solid ${stat.border}` }}>
                  <div ref={(el) => { statNumRefs.current[i] = el }} style={{ fontFamily: '"Space Mono",monospace', fontSize: 'clamp(1rem,2vw,1.3rem)', fontWeight: 700, color: stat.color, lineHeight: 1 }}>
                    0{stat.suffix}
                  </div>
                  <div style={{ fontFamily: '"Space Grotesk",sans-serif', fontSize: 'clamp(0.45rem,0.9vw,0.58rem)', color: 'var(--ink-soft)', marginTop: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.04em', lineHeight: 1.3 }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            <div
              ref={cardCRef}
              onMouseMove={handleCardMouseMove}
              onMouseLeave={handleCardMouseLeave}
              style={{ ...cardBase, background: '#fff', border: '1px solid var(--line)', boxShadow: '0 12px 32px rgba(21,22,26,0.06)', display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
            >
              {['Web Dev', 'React', 'Node.js', 'Deployment', 'Team Lead'].map((tag, i) => {
                const colors = ['var(--signal)', 'var(--mint)', 'var(--violet)', 'var(--alert)']
                const c = colors[i % colors.length]
                return (
                  <span
                    key={tag}
                    onMouseEnter={(e) => gsap.to(e.currentTarget, { scale: 1.08, opacity: 1, duration: 0.25, ease: 'power2.out' })}
                    onMouseLeave={(e) => gsap.to(e.currentTarget, { scale: 1, opacity: 0.85, duration: 0.4, ease: 'power2.out' })}
                    style={{ fontFamily: '"Space Mono",monospace', fontSize: 'clamp(0.45rem,1vw,0.58rem)', textTransform: 'uppercase', letterSpacing: '0.08em', color: c, border: `1.5px solid ${c}`, padding: '0.3rem 0.65rem', borderRadius: 9999, opacity: 0.85, cursor: 'default' }}
                  >
                    {tag}
                  </span>
                )
              })}
            </div>
          </div>
        </div>

        <div ref={lineRef} style={{ height: 1, background: 'var(--line-strong)', marginTop: 'clamp(2rem,5vw,3rem)', transformOrigin: 'left' }} />

        {/* Tech marquee */}
        <div ref={marqueeWrapRef} style={{ opacity: 0, overflow: 'hidden', padding: 'clamp(0.7rem,1.6vw,0.95rem) 0' }}>
          <div className="hero-marquee-track" style={{ display: 'flex', width: 'max-content' }}>
            {[...TECH_MARQUEE, ...TECH_MARQUEE].map((item, i) => (
              <span
                key={`${item}-${i}`}
                style={{
                  fontFamily: '"Space Mono",monospace',
                  fontSize: 'clamp(0.6rem,1.3vw,0.75rem)',
                  color: 'var(--ink-faint)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  paddingRight: 'clamp(1.5rem,3vw,2.5rem)',
                }}
              >
                {item}
                <span style={{ color: 'var(--signal)', marginLeft: 'clamp(1.5rem,3vw,2.5rem)' }}>—</span>
              </span>
            ))}
          </div>
        </div>

        {/* Bottom meta */}
        <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 'clamp(0.6rem,1.4vw,1rem)', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 'clamp(0.5rem,1vw,0.6rem)', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>KJ Somaiya School of Engineering</span>
          <div ref={scrollIndicRef} style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: 0 }}>
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: 'clamp(0.5rem,1vw,0.6rem)', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Scroll</span>
            <svg width="10" height="14" viewBox="0 0 10 14" fill="none">
              <path d="M5 1v12M1 9l4 4 4-4" stroke="var(--ink-faint)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.35; }
        }
        @keyframes hero-marquee-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .hero-marquee-track {
          animation: hero-marquee-scroll 24s linear infinite;
        }
        .hero-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (max-width: 860px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  )
}