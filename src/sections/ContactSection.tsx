import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import { splitChars } from '../utils/splitText'
import ScrambleText from '../components/ScrambleText'

gsap.registerPlugin(ScrollTrigger)

const LINKS = [
  { label:'LinkedIn', value:'Mohammed Baqir B', href:'https://www.linkedin.com/in/mohammed-baqir-bandarkar/', color:'var(--signal)' },
  { label:'GitHub', value:'mbaqir18786', href:'https://github.com/mbaqir18786', color:'var(--violet)' },
  { label:'Phone', value:'+91 76200 09616', href:'tel:+917620009616', color:'var(--mint)' },
]

function ContactLink({ link, index }: { link: typeof LINKS[0]; index: number }) {
  const rowRef = useRef<HTMLAnchorElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef<HTMLParagraphElement>(null)
  const [hov, setHov] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(lineRef.current, { scaleX: 0 }, {
        scaleX: 1, duration: 0.9, transformOrigin: 'left', ease: 'power3.out',
        scrollTrigger: { trigger: rowRef.current, start: 'top 92%' }, delay: index * 0.07
      })
      gsap.fromTo(rowRef.current, { y: 22, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.75, ease: 'power3.out',
        scrollTrigger: { trigger: rowRef.current, start: 'top 92%' }, delay: index * 0.1 + 0.15
      })
    }, rowRef)
    return () => ctx.revert()
  }, [index])

  return (
    <div style={{ position:'relative' }}>
      <div ref={lineRef} style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'var(--line)', transformOrigin:'left' }} />
      <a ref={rowRef} href={link.href} target="_blank" rel="noopener noreferrer"
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'clamp(1.4rem,4vw,2.2rem) 0', textDecoration:'none', opacity:0 }}
      >
        <div>
          <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.58rem', color:'var(--ink-faint)', textTransform:'uppercase', letterSpacing:'0.14em', marginBottom:'0.3rem' }}>{link.label}</p>
          <p ref={valueRef} style={{ fontFamily:'"Space Mono",monospace', fontWeight:700, fontSize:'clamp(1.1rem,3.2vw,2.4rem)', letterSpacing:'-0.04em', color: hov ? link.color : 'var(--ink-soft)', transition:'color 0.3s ease' }}>
            <ScrambleText text={link.value} isHovered={hov} />
          </p>
        </div>
        <motion.span
          animate={{ opacity: hov ? 1 : 0, x: hov ? 0 : -12, rotate: hov ? 0 : -15 }}
          transition={{ duration: 0.3, ease: [0.16,1,0.3,1] }}
          style={{ fontFamily:'"Space Mono",monospace', fontSize:'1.4rem', color: link.color }}
        >
          ↗
        </motion.span>
      </a>
    </div>
  )
}

export default function ContactSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const chars = splitChars(headingRef.current)
        gsap.fromTo(chars, { y: '115%', rotateZ: 2 }, {
          y: '0%', rotateZ: 0, duration: 1.1, stagger: 0.028, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 88%' }
        })
      }
      gsap.fromTo(subRef.current, { y: 20, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', delay: 0.25,
        scrollTrigger: { trigger: subRef.current, start: 'top 92%' }
      })
      gsap.fromTo(gridRef.current, { y: 24, opacity: 0 }, {
        y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4,
        scrollTrigger: { trigger: gridRef.current, start: 'top 92%' }
      })
    }, headingRef)
    return () => ctx.revert()
  }, [])

  const STATS = [
    { label:'Products shipped', value:'5+', color:'var(--signal)' },
    { label:'Years building', value:'2+', color:'var(--violet)' },
    { label:'Team size led', value:'5', color:'var(--alert)' },
    { label:'Uptime SLA', value:'99%', color:'var(--mint)' },
  ]

  return (
    <section id="contact" style={{ background:'var(--paper)', scrollMarginTop: 88, padding:'clamp(5.5rem,12vw,9rem) clamp(1.25rem,4vw,4rem) clamp(3rem,8vw,6rem)', position:'relative', overflow:'hidden', zIndex:2 }}>
      {/* Ambient glow */}
      <div style={{ position:'absolute', bottom:0, left:'50%', transform:'translateX(-50%)', width:'60vw', height:'30vw', background:'radial-gradient(ellipse at center, rgba(45,91,255,0.06) 0%, transparent 70%)', pointerEvents:'none' }} />

      <h2 ref={headingRef} style={{ fontFamily:'"Space Mono",monospace', fontWeight:700, fontSize:'clamp(3rem,12vw,12rem)', letterSpacing:'-0.05em', lineHeight:0.88, color:'var(--ink)', marginBottom:'1rem', position:'relative', zIndex:1 }}>
        Let's build.
      </h2>
      <p ref={subRef} style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:400, fontSize:'clamp(0.9rem,1.5vw,1.05rem)', color:'var(--ink-soft)', maxWidth:'28rem', lineHeight:1.7, marginBottom:'clamp(2.5rem,8vw,5rem)', opacity:0, position:'relative', zIndex:1 }}>
        Open to internships, freelance builds, and problems worth solving. If you have something real — reach out.
      </p>

      {/* Stat pills */}
      <div ref={gridRef} style={{ display:'flex', flexWrap:'wrap', gap:'1rem', marginBottom:'clamp(2.5rem,6vw,4rem)', opacity:0, position:'relative', zIndex:1 }}>
        {STATS.map(stat => (
          <div key={stat.label} style={{ border:`1px solid ${stat.color}`, borderRadius:12, padding:'1rem 1.4rem', background:'var(--paper-dim)' }}>
            <div style={{ fontFamily:'"Space Mono",monospace', fontWeight:700, fontSize:'clamp(1.2rem,3vw,2rem)', letterSpacing:'-0.04em', color:stat.color, lineHeight:1 }}>{stat.value}</div>
            <div style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.58rem', color:'var(--ink-faint)', textTransform:'uppercase', letterSpacing:'0.1em', marginTop:'0.4rem' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{ maxWidth:'42rem', position:'relative', zIndex:1 }}>
        {LINKS.map((l, i) => <ContactLink key={l.label} link={l} index={i} />)}
        <div style={{ height:1, background:'var(--line)' }} />
      </div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'clamp(2rem,5vw,3rem)', marginTop:'clamp(3rem,8vw,5rem)', borderTop:'1px solid var(--line)', position:'relative', zIndex:1 }}>
        <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.6rem', color:'var(--ink-faint)', textTransform:'uppercase', letterSpacing:'0.1em' }}>M Baqir © 2025</span>
        <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.6rem', color:'var(--ink-faint)', textTransform:'uppercase', letterSpacing:'0.1em' }}>KJSCE · AI &amp; Data Science</span>
      </div>
    </section>
  )
}
