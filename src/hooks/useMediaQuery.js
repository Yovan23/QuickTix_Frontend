import { useState, useEffect } from 'react'

export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)

        // Set initial value
        setMatches(media.matches)

        // Create listener
        const listener = (event) => setMatches(event.matches)

        // Add listener
        media.addEventListener('change', listener)

        // Cleanup
        return () => media.removeEventListener('change', listener)
    }, [query])

    return matches
}

// Preset hooks for common breakpoints
export function useIsMobile() {
    return useMediaQuery('(max-width: 639px)')
}

export function useIsTablet() {
    return useMediaQuery('(min-width: 640px) and (max-width: 1023px)')
}

export function useIsDesktop() {
    return useMediaQuery('(min-width: 1024px)')
}
