import { BrowserMultiFormatReader } from "@zxing/browser"
import { useEffect, useState } from "react"
import type { RefObject } from "react"

type UseBarcodeScannerOptions = {
  active: boolean
  open: boolean
  videoRef: RefObject<HTMLVideoElement | null>
  onCode: (code: string) => void
}

export function useBarcodeScanner({
  active,
  open,
  videoRef,
  onCode,
}: UseBarcodeScannerOptions) {
  const [cameraError, setCameraError] = useState("")
  const [scanError, setScanError] = useState("")

  useEffect(() => {
    if (!open) {
      return
    }

    let cancelled = false
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: "environment" } },
        })
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }

        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          video.setAttribute("playsinline", "true")
          await video.play()
        }
        setCameraError("")
      } catch {
        setCameraError("Camera access is required to scan products.")
      }
    }

    void startCamera()

    return () => {
      cancelled = true
      stream?.getTracks().forEach((track) => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }, [open, videoRef])

  useEffect(() => {
    if (!active || !open || !videoRef.current) {
      return
    }

    let stopped = false
    let stopScanner: (() => void) | undefined
    const reader = new BrowserMultiFormatReader(undefined, {
      delayBetweenScanAttempts: 120,
      delayBetweenScanSuccess: 300,
    })

    reader
      .decodeFromVideoElement(videoRef.current, (result, _error, controls) => {
        stopScanner = controls.stop
        const code = result?.getText().trim()
        if (!code || stopped) {
          return
        }

        stopped = true
        controls.stop()
        setScanError("")
        onCode(code)
      })
      .catch(() => {
        setScanError("Could not start the barcode scanner.")
      })

    return () => {
      stopped = true
      stopScanner?.()
    }
  }, [active, onCode, open, videoRef])

  return { cameraError, scanError }
}
