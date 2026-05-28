type NavigatorWithStandalone = Navigator & { standalone?: boolean }

/** Home-screen / installed PWA (no Safari address bar). */
export function isStandalonePwa(): boolean {
  if (typeof window === "undefined") {
    return false
  }

  const navigatorWithStandalone = window.navigator as NavigatorWithStandalone

  if (navigatorWithStandalone.standalone === true) {
    return true
  }

  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    window.matchMedia("(display-mode: fullscreen)").matches
  )
}

function syncAppHeight(): void {
  const height = window.visualViewport?.height ?? window.innerHeight
  document.documentElement.style.setProperty("--app-height", `${Math.round(height)}px`)
}

/** Apply `standalone-pwa` on `<html>` and sync visible viewport height for iOS PWA. */
export function initStandalonePwaClass(): void {
  if (typeof document === "undefined" || !isStandalonePwa()) {
    return
  }

  const root = document.documentElement
  root.classList.add("standalone-pwa")

  syncAppHeight()
  window.visualViewport?.addEventListener("resize", syncAppHeight)
  window.visualViewport?.addEventListener("scroll", syncAppHeight)
  window.addEventListener("resize", syncAppHeight)
}
