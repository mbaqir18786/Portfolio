import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import LogoLoop from '../components/LogoLoop'

const PROJECTS = [
  { name: 'HTML', color: 'var(--signal)' },
  { name: 'CSS', color: 'var(--mint)' },
  { name: 'JavaScript', color: 'var(--violet)' },
  { name: 'React', color: 'var(--alert)' },
  { name: 'Next.js', color: 'var(--signal)' },
  { name: 'TypeScript', color: 'var(--mint)' },
  { name: 'Node.js', color: 'var(--violet)' },
  { name: 'Python', color: 'var(--alert)' },
   { name: 'MongoDB', color: 'var(--signal)' },
  { name: 'Email Design', color: 'var(--mint)' },
  { name: 'Express.js', color: 'var(--violet)' },
  { name: 'SCSS', color: 'var(--alert)' },
  { name: 'Java', color: 'var(--signal)' },
  { name: 'C', color: 'var(--mint)' },
  { name: 'Backend', color: 'var(--violet)' },
  { name: 'Admin Panel', color: 'var(--alert)' },
  { name: 'Fullstack', color: 'var(--signal)' },
  { name: 'UI/UX', color: 'var(--mint)' },
  { name: 'Web Design', color: 'var(--violet)' },
  { name: 'Web Development', color: 'var(--alert)' },
  { name: 'Linux', color: 'var(--signal)' },
  { name: 'Git', color: 'var(--mint)' },
  { name: 'GitHub', color: 'var(--violet)' },
  { name: 'VS Code', color: 'var(--alert)' },
  { name: 'Figma', color: 'var(--signal)' },
  { name: 'Photoshop', color: 'var(--mint)' },
  { name: 'Team Work', color: 'var(--violet)' },
  { name: 'Problem Solving', color: 'var(--alert)' },
  { name: 'Automation', color: 'var(--signal)' },
  { name: 'Creativity', color: 'var(--mint)' },
  { name: 'Critical Thinking', color: 'var(--violet)' },
  { name: 'Adaptability', color: 'var(--alert)' },
  { name: 'Time Management', color: 'var(--signal)' },
  { name: 'Full stack', color: 'var(--mint)' },
  { name: 'Collaboration', color: 'var(--violet)' },
  { name: 'Project Management', color: 'var(--alert)' },
  


]


function ProjectChip({ name, color }: { name: string; color: string }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontFamily: '"Space Mono", monospace', fontWeight: 700, fontSize: 'clamp(1.2rem, 2.6vw, 1.9rem)', letterSpacing: '-0.02em', color: 'var(--ink)', whiteSpace: 'nowrap' }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      {name}
    </span>
  )
}

export default function MarqueeSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(labelRef.current, { opacity: 0, y: 12 }, {
        opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 85%' }
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={sectionRef} style={{ background: 'var(--paper-dim)', padding: 'clamp(3rem,8vw,6rem) 0', overflow: 'hidden', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', position: 'relative', zIndex: 2 }}>
      <div ref={labelRef} style={{ padding: '0 clamp(1.25rem,4vw,4rem)', marginBottom: '2.5rem', opacity: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--mint)', display: 'inline-block' }} />
        <span style={{ fontFamily: '"Space Mono",monospace', fontSize: '0.6rem', color: 'var(--ink-faint)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
          Tools and Technologies I Use
        </span>
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <LogoLoop
          logos={PROJECTS.map(p => ({ node: <ProjectChip name={p.name} color={p.color} /> }))}
          speed={55}
          gap={56}
          fadeOut
          fadeOutColor="var(--paper-dim)"
          pauseOnHover
        />
      </div>
      <LogoLoop
        logos={[...PROJECTS].reverse().map(p => ({ node: <ProjectChip name={p.name} color={p.color} /> }))}
        speed={42}
        direction="right"
        gap={56}
        fadeOut
        fadeOutColor="var(--paper-dim)"
        pauseOnHover
      />
    </div>
  )
}
