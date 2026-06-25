import { useEffect, useRef, useState } from 'react'

interface PathAnimationConfig {
  delay?: number
  duration?: number
}

export const useSvgPathAnimation = (config: PathAnimationConfig = {}) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isInView, setIsInView] = useState(false)
  const styleRef = useRef<HTMLStyleElement | null>(null)

  // Intersection Observer to detect when chart enters viewport
  useEffect(() => {
    if (!svgRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isInView) {
          setIsInView(true)
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(svgRef.current)

    return () => {
      if (svgRef.current) {
        observer.unobserve(svgRef.current)
      }
    }
  }, [isInView])

  // Create and inject CSS animations
  useEffect(() => {
    // Create keyframes for line drawing animations
    const style = document.createElement('style')
    style.textContent = `
      @keyframes lineDraw {
        from {
          stroke-dashoffset: var(--line-length);
        }
        to {
          stroke-dashoffset: 0;
        }
      }
      
      polyline[data-animate="paceline"] {
        --line-length: 2000;
        stroke-dasharray: var(--line-length);
        stroke-dashoffset: var(--line-length);
      }
      
      polyline[data-animate="actualline"] {
        --line-length: 2500;
        stroke-dasharray: var(--line-length);
        stroke-dashoffset: var(--line-length);
      }
      
      polyline[data-animate="projectedline"] {
        --line-length: 1200;
        stroke-dasharray: var(--line-length);
        stroke-dashoffset: var(--line-length);
      }
      
      svg[data-animated="true"] polyline[data-animate="paceline"] {
        animation: lineDraw 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s forwards;
      }
      
      svg[data-animated="true"] polyline[data-animate="actualline"] {
        animation: lineDraw 2s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.8s forwards;
      }
      
      svg[data-animated="true"] polyline[data-animate="projectedline"] {
        animation: lineDraw 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 1.5s forwards;
      }
    `
    document.head.appendChild(style)
    styleRef.current = style

    return () => {
      if (styleRef.current && document.head.contains(styleRef.current)) {
        document.head.removeChild(styleRef.current)
      }
    }
  }, [])

  // Trigger animations when in view
  useEffect(() => {
    if (!isInView || !svgRef.current) return

    // Set data-animated attribute to trigger CSS animations
    svgRef.current.setAttribute('data-animated', 'true')
  }, [isInView])

  return { svgRef, isInView }
}
