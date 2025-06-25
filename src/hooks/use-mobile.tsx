
import * as React from "react"

// Define breakpoints according to Tailwind defaults
const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536
}

export type BreakpointKey = keyof typeof BREAKPOINTS

/**
 * Custom hook to determine if the viewport is below a specific breakpoint
 * @param breakpoint The breakpoint to check. Defaults to 'md' (768px)
 * @returns Boolean indicating if viewport is below the breakpoint
 */
export function useIsMobile(breakpoint: BreakpointKey = "md") {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS[breakpoint])
    }
    
    // Initial check
    checkMobile()
    
    // Set up listener for window resize with throttling
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(checkMobile, 100)
    }
    
    window.addEventListener("resize", handleResize, { passive: true })
    
    // Clean up
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [breakpoint])

  return !!isMobile
}

/**
 * Hook to get current viewport width
 * Useful for more complex responsive logic
 */
export function useViewportWidth() {
  const [width, setWidth] = React.useState<number>(0)

  React.useEffect(() => {
    const updateWidth = () => setWidth(window.innerWidth)
    
    // Initial measurement
    updateWidth()
    
    // Throttled resize handler
    let timeoutId: NodeJS.Timeout
    const handleResize = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateWidth, 100)
    }
    
    window.addEventListener("resize", handleResize, { passive: true })
    
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeoutId)
    }
  }, [])

  return width
}

/**
 * Hook to detect if user is on a touch device
 */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = React.useState(false)

  React.useEffect(() => {
    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore - for older browsers
        navigator.msMaxTouchPoints > 0
      )
    }
    
    checkTouch()
  }, [])

  return isTouch
}
