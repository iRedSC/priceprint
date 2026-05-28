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

/** Apply `standalone-pwa` on `<html>` for CSS that trims browser-only bottom spacing. */
export function initStandalonePwaClass(): void {
  if (typeof document === "undefined" || !isStandalonePwa()) {
    return
  }

  document.documentElement.classList.add("standalone-pwa")
}
