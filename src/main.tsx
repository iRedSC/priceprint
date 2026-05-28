import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConvexProvider, ConvexReactClient } from 'convex/react'
import './index.css'
import { TooltipProvider } from '@/components/ui/tooltip'
import App from './App.tsx'
import { initStandalonePwaClass } from './lib/standalonePwa.ts'
import { registerServiceWorker } from './registerServiceWorker.ts'

initStandalonePwaClass()

const convexUrl = import.meta.env.VITE_CONVEX_URL

if (!convexUrl) {
  throw new Error('Missing VITE_CONVEX_URL in environment.')
}

const convex = new ConvexReactClient(convexUrl)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConvexProvider client={convex}>
      <TooltipProvider delayDuration={300}>
        <App />
      </TooltipProvider>
    </ConvexProvider>
  </StrictMode>,
)

registerServiceWorker()
