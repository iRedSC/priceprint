import { useEffect, useState } from "react"

const MD_QUERY = "(min-width: 768px)"

export function useMinWidthMd() {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(MD_QUERY).matches : false,
  )

  useEffect(() => {
    const mq = window.matchMedia(MD_QUERY)
    const listener = () => setMatches(mq.matches)
    listener()
    mq.addEventListener("change", listener)
    return () => mq.removeEventListener("change", listener)
  }, [])

  return matches
}
