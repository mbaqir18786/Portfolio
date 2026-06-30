import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { splitChars, splitWords } from '../utils/splitText'

gsap.registerPlugin(ScrollTrigger)

interface Product {
  num: string
  name: string
  type: string
  org: string
  year: string
  desc: string
  stack: string[]
  proof: string
  color: string
}

const PRODUCTS: Product[] = [
  {
    num: '01',
    name: 'Alumni Cell — Event Portals',
    type: 'Web + Automation',
    org: 'KJSCE Alumni Cell',
    year: '2025',
    desc: 'Multiple event registration portals. Google Sheets backend, automated email + ticket PDFs via Gmail on every signup. Zero manual work for organisers.',
    stack: ['HTML/CSS/JS', 'Google Apps Script', 'Vercel', 'MailApp'],
    proof: 'Zero manual emails. DB auto-populated on every registration.',
    color: 'var(--signal)',
  },
  {
    num: '02',
    name: 'Kickstart — Paid Event Site',
    type: 'Web + Payments',
    org: 'KJSCE Alumni Cell',
    year: '2025',
    desc: 'End-to-end ticketed event website. Students register, pay via UPI, submit transaction ID — system validates and fires a ticket PDF to their inbox.',
    stack: ['HTML/CSS/JS', 'Apps Script', 'UPI Flow', 'Gmail API'],
    proof: 'Handled real money flow for a live college event.',
    color: 'var(--alert)',
  },
  {
    num: '03',
    name: 'Professor Portfolio + CMS',
    type: 'Website + Admin Panel',
    org: 'KJSCE Faculty',
    year: '2024',
    desc: 'Fully editable portfolio for a professor — no coding needed. Custom admin panel where every section is editable in-browser. Live on save.',
    stack: ['React', 'Node.js', 'MongoDB', 'Custom CMS'],
    proof: 'Non-technical user, full content control, no dev needed.',
    color: 'var(--violet)',
  },
  {
    num: '04',
    name: 'College Learning Platform',
    type: 'Full Product',
    org: 'KJSCE Internal',
    year: '2024',
    desc: 'Coursera-style LMS. Upload courses, MCQ, T/F, Match the Following, Fill in the Blank, Lab Activity, short/long answers. Full admin CRUD. Led a 5-person team.',
    stack: ['React', 'Node.js', 'PostgreSQL', 'REST API'],
    proof: '6 assessment types, one platform. Built as team lead.',
    color: 'var(--mint)',
  },
  {
    num: '05',
    name: 'EllanorAI — Cloud Services Site',
    type: 'Startup Website',
    org: 'EllanorAI (Internship)',
    year: '2024',
    desc: 'Startup had no website. Built their full marketing site for cloud services from scratch — design to deployment, solo, in 3 months.',
    stack: ['HTML/CSS/JS', 'Figma', 'Vercel'],
    proof: 'Zero to live in 3 months. First real client delivery.',
    color: 'var(--signal)',
  },
]

function ProductCard({ product }: { product: Product }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const numRef = useRef<HTMLSpanElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const proofRef = useRef<HTMLDivElement>(null)
  const stackRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  // Parallax on the proof pill, tied to this card's own scroll progress.
  const { scrollYProgress } = useScroll({ target: cardRef, offset: ['start end', 'end start'] })
  const ySmooth = useSpring(useTransform(scrollYProgress, [0, 1], [30, -30]), { stiffness: 60, damping: 18 })

  // Hover micro-interaction: set up once, torn down on unmount. Using
  // useLayoutEffect + addEventListener (instead of inline onMouseEnter/Leave)
  // avoids re-binding closures over `product.color` on every render and
  // guarantees the listeners are removed if the card unmounts mid-animation.
  useLayoutEffect(() => {
    const card = cardRef.current
    if (!card) return

    const handleMouseEnter = () => {
      gsap.to(numRef.current, { color: product.color, duration: 0.4, ease: 'power2.out', overwrite: 'auto' })
      gsap.to(lineRef.current, { background: product.color, duration: 0.3, overwrite: 'auto' })
    }
    const handleMouseLeave = () => {
      gsap.to(numRef.current, { color: 'var(--line-strong)', duration: 0.5, overwrite: 'auto' })
      gsap.to(lineRef.current, { background: 'var(--line)', duration: 0.4, overwrite: 'auto' })
    }

    card.addEventListener('mouseenter', handleMouseEnter)
    card.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter)
      card.removeEventListener('mouseleave', handleMouseLeave)
      gsap.killTweensOf([numRef.current, lineRef.current])
    }
  }, [product.color])

  // Reveal-on-scroll timeline, scoped with gsap.context so every tween and
  // ScrollTrigger it creates is automatically reverted/killed on unmount —
  // this is what prevents orphaned ScrollTriggers piling up as cards
  // mount/unmount (the main source of the memory leak in the old version).
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none none',
          scroller: window,
        },
        defaults: { ease: 'power3.out' },
      })

      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.9, transformOrigin: 'left' }, 0)
      tl.fromTo(numRef.current, { x: -24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.7 }, 0.08)

      if (nameRef.current) {
        const chars = splitChars(nameRef.current)
        tl.fromTo(chars, { y: '115%', rotateZ: 3 }, { y: '0%', rotateZ: 0, duration: 0.85, stagger: 0.018 }, 0.18)
      }
      if (descRef.current) {
        const words = splitWords(descRef.current)
        tl.fromTo(words, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.7, stagger: 0.035 }, 0.42)
      }

      tl.fromTo(proofRef.current, { x: -14, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6 }, 0.58)
      tl.fromTo(stackRef.current, { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 }, 0.68)
    }, cardRef)

    return () => ctx.revert()
  }, [])

  return (
    <div ref={cardRef} style={{ position: 'relative', padding: 'clamp(2rem,5vw,3.5rem) 0', cursor: 'default' }}>
      <div
        ref={lineRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 1,
          background: 'var(--line)',
          transformOrigin: 'left',
        }}
      />

      <div style={{ display: 'flex', gap: 'clamp(1.2rem,4vw,3rem)', alignItems: 'flex-start' }}>
        {/* Number */}
        <span
          ref={numRef}
          style={{
            fontFamily: '"Space Mono",monospace',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem,7vw,6rem)',
            letterSpacing: '-0.06em',
            color: 'var(--line-strong)',
            lineHeight: 1,
            flexShrink: 0,
            minWidth: 'clamp(3rem,8vw,7rem)',
            transition: 'color 0.4s',
            opacity: 0,
          }}
        >
          {product.num}
        </span>

        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Type + org row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: '"Space Mono",monospace',
                fontSize: '0.6rem',
                color: product.color,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                border: `1px solid ${product.color}`,
                padding: '0.2rem 0.6rem',
                borderRadius: 4,
                fontWeight: 700,
              }}
            >
              {product.type}
            </span>
            <span
              style={{
                fontFamily: '"Space Mono",monospace',
                fontSize: '0.6rem',
                color: 'var(--ink-faint)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              {product.org}
            </span>
            <span style={{ fontFamily: '"Space Mono",monospace', fontSize: '0.6rem', color: 'var(--ink-faint)', marginLeft: 'auto' }}>
              {product.year}
            </span>
          </div>

          {/* Name */}
          <h3
            ref={nameRef}
            style={{
              fontFamily: '"Space Mono",monospace',
              fontWeight: 700,
              fontSize: 'clamp(1.1rem,2.8vw,2rem)',
              letterSpacing: '-0.04em',
              color: 'var(--ink)',
              lineHeight: 1.1,
              marginBottom: '0.85rem',
              margin: 0,
            }}
          >
            {product.name}
          </h3>

          {/* Desc */}
          <p
            ref={descRef}
            style={{
              fontFamily: '"Space Grotesk",sans-serif',
              fontWeight: 400,
              fontSize: 'clamp(0.85rem,1.4vw,1rem)',
              color: 'var(--ink-soft)',
              lineHeight: 1.7,
              maxWidth: '44rem',
              marginBottom: '1.1rem',
              margin: 0,
            }}
          >
            {product.desc}
          </p>

          {/* Proof pill — parallax floats */}
          <motion.div
            ref={proofRef}
            style={{
              y: ySmooth,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1rem',
              background: `color-mix(in srgb, ${product.color} 8%, transparent)`,
              border: `1px solid color-mix(in srgb, ${product.color} 30%, transparent)`,
              padding: '0.4rem 1rem',
              borderRadius: 9999,
              opacity: 0,
              width: 'fit-content',
            }}
          >
            <span style={{ width: 5, height: 5, borderRadius: '50%', background: product.color, flexShrink: 0 }} />
            <span
              style={{
                fontFamily: '"Space Mono",monospace',
                fontSize: '0.6rem',
                color: product.color,
                letterSpacing: '0.04em',
                fontWeight: 700,
                whiteSpace: 'nowrap',
              }}
            >
              {product.proof}
            </span>
          </motion.div>

          {/* Stack tags */}
          <div ref={stackRef} style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', opacity: 0 }}>
            {product.stack.map((t) => (
              <span
                key={t}
                style={{
                  fontFamily: '"Space Mono",monospace',
                  fontSize: '0.58rem',
                  color: 'var(--ink-faint)',
                  background: 'var(--paper-dim)',
                  padding: '0.22rem 0.6rem',
                  borderRadius: 3,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  border: '1px solid var(--line)',
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WorkSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const chars = splitChars(headingRef.current)
        gsap.fromTo(
          chars,
          { y: '115%', rotateZ: 2 },
          {
            y: '0%',
            rotateZ: 0,
            duration: 1.1,
            stagger: 0.035,
            ease: 'power4.out',
            scrollTrigger: { trigger: headingRef.current, start: 'top 88%', scroller: window },
          }
        )
      }

      gsap.fromTo(
        subRef.current,
        { opacity: 0, x: -16 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: subRef.current, start: 'top 90%', scroller: window },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{
        background: 'var(--paper)',
        scrollMarginTop: 88,
        padding: 'clamp(5.5rem,12vw,9rem) clamp(1.25rem,4vw,4rem) clamp(2rem,6vw,4rem)',
        position: 'relative',
        zIndex: 2,
      }}
    >
      <h2
        ref={headingRef}
        style={{
          fontFamily: '"Space Mono",monospace',
          fontWeight: 700,
          fontSize: 'clamp(3rem,11vw,11rem)',
          letterSpacing: '-0.05em',
          lineHeight: 0.88,
          color: 'var(--ink)',
          marginBottom: '0.6rem',
          margin: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        Products
      </h2>

      <p
        ref={subRef}
        style={{
          fontFamily: '"Space Mono",monospace',
          fontSize: '0.6rem',
          color: 'var(--ink-faint)',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
          marginBottom: 'clamp(2rem,6vw,4rem)',
          opacity: 0,
          margin: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        — things actually used by real people
      </p>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {PRODUCTS.map((product) => (
          <ProductCard key={product.num} product={product} />
        ))}
        <div style={{ height: 1, background: 'var(--line)' }} />
      </div>
    </section>
  )
}