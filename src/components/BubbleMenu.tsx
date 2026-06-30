import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { gsap } from 'gsap';

export interface BubbleMenuItem {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: { bgColor?: string; textColor?: string };
  onClick?: () => void;
}

interface BubbleMenuProps {
  logo?: string | ReactNode;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items?: BubbleMenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
}

const DEFAULT_ITEMS: BubbleMenuItem[] = [
  { label: 'home', href: '#', ariaLabel: 'Home', rotation: -3, hoverStyles: { bgColor: '#2D5BFF', textColor: '#ffffff' } },
  { label: 'work', href: '#work', ariaLabel: 'Work', rotation: 2, hoverStyles: { bgColor: '#00966B', textColor: '#ffffff' } },
  { label: 'experience', href: '#experience', ariaLabel: 'Experience', rotation: 8, hoverStyles: { bgColor: '#7B4DD6', textColor: '#ffffff' } },
  { label: 'contact', href: '#contact', ariaLabel: 'Contact', rotation: -8, hoverStyles: { bgColor: '#FF5A36', textColor: '#ffffff' } }
];

// CSS custom properties aren't part of React's typed CSSProperties, so
// component-scoped vars are written through this helper to keep the JSX
// free of `as any` casts at each call site.
const cssVars = (vars: Record<string, string>): CSSProperties => vars as CSSProperties;

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = 'Toggle menu',
  menuBg = '#fff',
  menuContentColor = '#111',
  useFixedPosition = true,
  items,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement>(null);
  const bubblesRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const labelRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const menuItems = items?.length ? items : DEFAULT_ITEMS;

  const containerClassName = [
    'bubble-menu',
    useFixedPosition ? 'fixed' : 'absolute',
    'left-0 right-0 top-6',
    'flex items-center justify-between',
    'gap-4 px-6',
    'pointer-events-none',
    'z-[1001]',
    className
  ]
    .filter(Boolean)
    .join(' ');

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  const handleItemClick = (e: React.MouseEvent, item: BubbleMenuItem) => {
    // Allow in-page anchor links to be handled by the parent's scroll logic
    // (e.g. Lenis smooth scroll) instead of the browser's default jump.
    if (item.onClick) {
      e.preventDefault();
      item.onClick();
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter((b): b is HTMLAnchorElement => Boolean(b));
    const labels = labelRefs.current.filter((l): l is HTMLSpanElement => Boolean(l));
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: 'flex' });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, { scale: 1, duration: animationDuration, ease: animationEase });
        if (labels[i]) {
          tl.to(labels[i], { y: 0, autoAlpha: 1, duration: animationDuration, ease: 'power3.out' }, '-=' + animationDuration * 0.9);
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, { y: 24, autoAlpha: 0, duration: 0.2, ease: 'power3.in' });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: 'power3.in',
        onComplete: () => {
          gsap.set(overlay, { display: 'none' });
          setShowOverlay(false);
        }
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (isMenuOpen) {
        const bubbles = bubblesRef.current.filter((b): b is HTMLAnchorElement => Boolean(b));
        const isDesktop = window.innerWidth >= 900;
        bubbles.forEach((bubble, i) => {
          const item = menuItems[i];
          if (bubble && item) {
            const rotation = isDesktop ? (item.rotation ?? 0) : 0;
            gsap.set(bubble, { rotation });
          }
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <style>{`
        .bubble-menu .menu-line {
          transition: transform 0.3s ease, opacity 0.3s ease;
          transform-origin: center;
        }
        @media (min-width: 900px) {
          .bubble-menu-items .pill-link { transform: rotate(var(--item-rot)); }
          .bubble-menu-items .pill-link:hover {
            transform: rotate(var(--item-rot)) scale(1.05);
            background: var(--hover-bg) !important;
            color: var(--hover-color) !important;
          }
          .bubble-menu-items .pill-link:active { transform: rotate(var(--item-rot)) scale(.95); }
        }
        @media (max-width: 899px) {
          .bubble-menu-items { padding-top: 110px; align-items: flex-start; }
          .bubble-menu-items .pill-list { row-gap: 14px; flex-direction: column; }
          .bubble-menu-items .pill-col { flex: 0 0 100% !important; width: 100%; }
          .bubble-menu-items .pill-link {
            font-size: clamp(1.3rem, 5vw, 2.2rem);
            padding: clamp(1rem, 3vw, 1.6rem) 0;
            min-height: 64px !important;
          }
          .bubble-menu-items .pill-link:hover { transform: scale(1.03); background: var(--hover-bg); color: var(--hover-color); }
        }
      `}</style>

      <nav className={containerClassName} style={style} aria-label="Main navigation">
        <div
          className="bubble logo-bubble inline-flex items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(21,22,26,0.08)] pointer-events-auto h-12 px-5 gap-2 will-change-transform border border-[var(--line)]"
          aria-label="Logo"
          style={{ background: menuBg }}
        >
          {typeof logo === 'string' ? (
            <img src={logo} alt="Logo" className="max-h-[60%] max-w-full object-contain block" />
          ) : (
            logo
          )}
        </div>

        <button
          type="button"
          className={`bubble toggle-bubble menu-btn ${isMenuOpen ? 'open' : ''} inline-flex flex-col items-center justify-center rounded-full bg-white shadow-[0_2px_12px_rgba(21,22,26,0.08)] pointer-events-auto w-12 h-12 border border-[var(--line)] cursor-pointer p-0 will-change-transform`}
          onClick={handleToggle}
          aria-label={menuAriaLabel}
          aria-pressed={isMenuOpen}
          style={{ background: menuBg }}
        >
          <span
            className="menu-line block mx-auto rounded-[2px]"
            style={{ width: 22, height: 2, background: menuContentColor, transform: isMenuOpen ? 'translateY(4px) rotate(45deg)' : 'none' }}
          />
          <span
            className="menu-line short block mx-auto rounded-[2px]"
            style={{ marginTop: '6px', width: 22, height: 2, background: menuContentColor, transform: isMenuOpen ? 'translateY(-4px) rotate(-45deg)' : 'none' }}
          />
        </button>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${useFixedPosition ? 'fixed' : 'absolute'} inset-0 flex items-center justify-center pointer-events-none z-[1000]`}
          style={{ background: 'var(--paper)', backdropFilter: 'blur(10px)' }}
          aria-hidden={!isMenuOpen}
        >
          <ul className="pill-list list-none m-0 px-6 w-full max-w-[640px] mx-auto flex flex-wrap gap-3 pointer-events-auto" role="menu" aria-label="Menu links">
            {menuItems.map((item, idx) => (
              <li key={idx} role="none" className="pill-col flex justify-center items-stretch [flex:0_0_100%] box-border">
                <a
                  role="menuitem"
                  href={item.href}
                  aria-label={item.ariaLabel || item.label}
                  onClick={e => handleItemClick(e, item)}
                  className="pill-link w-full rounded-[24px] no-underline bg-white text-inherit shadow-[0_2px_14px_rgba(21,22,26,0.06)] flex items-center justify-center relative transition-[background,color] duration-300 ease-in-out box-border border border-[var(--line)]"
                  style={{
                    ...cssVars({
                      '--item-rot': `${item.rotation ?? 0}deg`,
                      '--pill-bg': menuBg,
                      '--pill-color': menuContentColor,
                      '--hover-bg': item.hoverStyles?.bgColor || '#f3f4f6',
                      '--hover-color': item.hoverStyles?.textColor || menuContentColor,
                    }),
                    background: 'var(--pill-bg)',
                    color: 'var(--pill-color)',
                    minHeight: 64,
                    fontFamily: '"Space Mono", monospace',
                    fontSize: 'clamp(1.1rem, 3vw, 1.6rem)',
                    fontWeight: 500,
                    willChange: 'transform'
                  }}
                  ref={el => { bubblesRef.current[idx] = el; }}
                >
                  <span
                    className="pill-label inline-block"
                    style={{ willChange: 'transform, opacity', lineHeight: 1.2 }}
                    ref={el => { labelRefs.current[idx] = el; }}
                  >
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
