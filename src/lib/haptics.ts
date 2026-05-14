let hapticToggle: HTMLInputElement | null = null

function getHapticToggle() {
  if (typeof document === "undefined") {
    return null
  }

  if (hapticToggle?.isConnected) {
    return hapticToggle
  }

  hapticToggle = document.createElement("input")
  hapticToggle.type = "checkbox"
  hapticToggle.tabIndex = -1
  hapticToggle.setAttribute("aria-hidden", "true")
  hapticToggle.style.cssText = [
    "position:fixed",
    "left:-9999px",
    "top:0",
    "width:1px",
    "height:1px",
    "opacity:0",
    "pointer-events:none",
  ].join(";")

  document.body.append(hapticToggle)
  return hapticToggle
}

export function triggerHapticFeedback() {
  if (typeof window === "undefined") {
    return
  }

  navigator.vibrate?.(10)

  // iOS gives native tactile feedback for toggles even though it lacks the Vibration API.
  getHapticToggle()?.click()
}
