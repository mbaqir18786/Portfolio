import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { splitChars } from '../utils/splitText'
import ScrollReveal from '../components/ScrollReveal'

gsap.registerPlugin(ScrollTrigger)

const TIMELINE = [
  { year:'2025 →', role:'Tech Head', org:'Alumni Cell, KJSCE', period:'Present', type:'Leadership', color:'var(--signal)',
    bullets:['Leading the full tech team — web dev, automation, team management.','No tech infrastructure existed before me. Built the systems from zero.','Coordinating with council heads, faculty, and external vendors.'] },
  { year:'2025', role:'Jt. Tech Head', org:'Alumni Cell, KJSCE', period:'Jul 2025', type:'Leadership', color:'var(--signal)',
    bullets:['Led front-end dev for all Alumni Cell web properties.','Built event portals with automated email + ticket notifications.','Coordinated 3 developers, shipped updates ahead of schedule.'] },
  { year:'2025', role:'Internshala Student Partner', org:'Internshala', period:'May – Jul 2025', type:'Campus', color:'var(--violet)',
    bullets:['Selected as top campus leader to represent Internshala.','Ran campaigns that drove measurable sign-up growth on campus.'] },
  { year:'2024–25', role:'Web Developer', org:'EllanorAI', period:'3-month internship', type:'Internship', color:'var(--alert)',
    bullets:['Startup had no website — built their full cloud services site solo.','Handled everything: design, development, deployment.'] },
  { year:'2022', role:'B.Tech AI & Data Science', org:'KJ Somaiya College of Engineering', period:'Expected Feb 2028', type:'Education', color:'var(--mint)',
    bullets:['Coursework: Data Structures, Algorithms, DBMS, OOP.','JEE Mains 2024 — 93.75 percentile.'] },
]

// Full-width statement, word-by-word reveal as you scroll past
function CinematicStatement() {
  const ref = useRef<HTMLDivElement>(null)

  return (
    <div ref={ref} style={{ minHeight:'70svh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', background:'var(--paper-dim)', zIndex:2, borderTop:'1px solid var(--line)', borderBottom:'1px solid var(--line)' }}>
      <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(45,91,255,0.04) 0%, transparent 70%)', pointerEvents:'none', zIndex:1 }} />

      <div style={{ position:'relative', zIndex:2, maxWidth:'58rem', padding:'0 clamp(1.5rem,6vw,4rem)', textAlign:'center' }}>
        <ScrollReveal
          baseOpacity={0.15}
          baseRotation={2}
          blurStrength={3}
          containerClassName="!my-0"
          textClassName="!font-mono"
        >
          {`I don't make side projects. I build products that people actually use — event portals, ticketing systems, learning platforms, automation pipelines. Real problems. Real users. Real stakes.`}
        </ScrollReveal>
      </div>
    </div>
  )
}

function TimelineRow({ item }: { item: typeof TIMELINE[0] }) {
  const rowRef = useRef<HTMLDivElement>(null)
  const roleRef = useRef<HTMLHeadingElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const colorBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const st = { trigger: rowRef.current, start: 'top 88%', toggleActions: 'play none none none' }
      const tl = gsap.timeline({ scrollTrigger: st, defaults: { ease: 'power3.out' } })

      tl.fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8, transformOrigin: 'left' }, 0)
      tl.fromTo(colorBarRef.current, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: 'power3.out', transformOrigin: 'top' }, 0.1)
      tl.fromTo(dotRef.current, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(3)' }, 0.2)

      if (roleRef.current) {
        const chars = splitChars(roleRef.current)
        tl.fromTo(chars, { y: '115%' }, { y: '0%', duration: 0.75, stagger: 0.02 }, 0.12)
      }
      tl.fromTo(contentRef.current, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 0.38)
    }, rowRef)
    return () => ctx.revert()
  }, [])

  const handleMouseEnter = () => {
    gsap.to(colorBarRef.current, { opacity: 1, duration: 0.3 })
  }
  const handleMouseLeave = () => {
    gsap.to(colorBarRef.current, { opacity: 0.6, duration: 0.4 })
  }

  return (
    <div ref={rowRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ position:'relative', display:'flex' }}>
      {/* Left color accent bar — wide enough to actually read as color */}
      <div ref={colorBarRef} style={{ width:4, flexShrink:0, background:item.color, opacity:0.6, borderRadius:2, marginRight:'clamp(1.5rem,4vw,3rem)', transformOrigin:'top' }} />

      <div style={{ flex:1 }}>
        <div ref={lineRef} style={{ height:1, background:'var(--line)', transformOrigin:'left', marginBottom:'clamp(1.5rem,4vw,2.5rem)' }} />

        <div style={{ display:'flex', gap:'clamp(1rem,3vw,2.5rem)', paddingBottom:'clamp(2rem,5vw,3rem)' }}>
          {/* Year + dot */}
          <div style={{ width:'clamp(4rem,7vw,6rem)', flexShrink:0, paddingTop:'0.3rem' }}>
            <div ref={dotRef} style={{ width:8, height:8, borderRadius:'50%', background:item.color, boxShadow:`0 0 12px ${item.color}`, marginBottom:'0.5rem', opacity:0 }} />
            <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.6rem', color:'var(--ink-faint)', textTransform:'uppercase', letterSpacing:'0.08em', display:'block' }}>{item.year}</span>
          </div>

          {/* Content */}
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.35rem', flexWrap:'wrap' }}>
              <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.58rem', color:item.color, textTransform:'uppercase', letterSpacing:'0.1em', border:`1px solid ${item.color}`, padding:'0.15rem 0.5rem', borderRadius:3, fontWeight:700 }}>{item.type}</span>
              <span style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.58rem', color:'var(--ink-faint)' }}>{item.period}</span>
            </div>

            <h3 ref={roleRef} style={{ fontFamily:'"Space Mono",monospace', fontWeight:700, fontSize:'clamp(1rem,2.4vw,1.8rem)', letterSpacing:'-0.04em', color:'var(--ink)', lineHeight:1.1, marginBottom:'0.3rem' }}>
              {item.role}
            </h3>
            <p style={{ fontFamily:'"Space Mono",monospace', fontSize:'0.62rem', color:'var(--ink-faint)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'0.9rem' }}>{item.org}</p>

            <div ref={contentRef} style={{ opacity:0 }}>
              <ul style={{ listStyle:'none', display:'flex', flexDirection:'column', gap:'0.45rem' }}>
                {item.bullets.map((b, j) => (
                  <li key={j} style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
                    <span style={{ width:4, height:4, borderRadius:'50%', background:item.color, opacity:0.5, flexShrink:0, marginTop:'0.5rem' }} />
                    <span style={{ fontFamily:'"Space Grotesk",sans-serif', fontWeight:400, fontSize:'clamp(0.82rem,1.3vw,0.95rem)', color:'var(--ink-soft)', lineHeight:1.65 }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ExperienceSection() {
  const headingRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (headingRef.current) {
        const chars = splitChars(headingRef.current)
        gsap.fromTo(chars, { y: '115%', rotateZ: 2 }, {
          y: '0%', rotateZ: 0, duration: 1.1, stagger: 0.035, ease: 'power4.out',
          scrollTrigger: { trigger: headingRef.current, start: 'top 88%' }
        })
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <CinematicStatement />
      <section id="experience" ref={sectionRef} style={{ background:'var(--paper)', scrollMarginTop: 88, padding:'clamp(5.5rem,12vw,9rem) clamp(1.25rem,4vw,4rem) clamp(2rem,6vw,4rem)', position:'relative', zIndex:2 }}>
        <h2 ref={headingRef} style={{ fontFamily:'"Space Mono",monospace', fontWeight:700, fontSize:'clamp(3rem,11vw,11rem)', letterSpacing:'-0.05em', lineHeight:0.88, color:'var(--ink)', marginBottom:'clamp(2.5rem,8vw,5rem)', position:'relative', zIndex:1 }}>
          Timeline
        </h2>
        <div style={{ maxWidth:'54rem', position:'relative', zIndex:1 }}>
          {TIMELINE.map((item, i) => <TimelineRow key={i} item={item} />)}
        </div>
      </section>
    </>
  )
}
