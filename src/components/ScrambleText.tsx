import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
const rand = () => CHARS[Math.floor(Math.random() * CHARS.length)]

interface Props { text: string; isHovered: boolean; className?: string }

export default function ScrambleText({ text, isHovered, className }: Props) {
  const [display, setDisplay] = useState(text)
  const frameRef = useRef(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (!isHovered) { setDisplay(text); frameRef.current = 0; return }
    frameRef.current = 0
    timerRef.current = setInterval(() => {
      frameRef.current += 1
      const revealed = Math.floor(frameRef.current / 4)
      setDisplay(text.split('').map((c, i) => {
        if (c === ' ') return ' '
        if (i < revealed) return c
        return rand()
      }).join(''))
      if (revealed >= text.length) { setDisplay(text); clearInterval(timerRef.current!) }
    }, 25)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [isHovered, text])

  return <span className={className}>{display}</span>
}
