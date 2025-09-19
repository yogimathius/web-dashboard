import { useEffect, useState } from 'react'

interface ServiceWorkerState {
  isSupported: boolean
  isRegistered: boolean
  registration?: ServiceWorkerRegistration
  updateAvailable: boolean
  isInstalling: boolean
  error?: string
}

export const useServiceWorker = (swUrl?: string) => {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    updateAvailable: false,
    isInstalling: false,
  })

  useEffect(() => {
    if (!state.isSupported || !swUrl) {
      return
    }

    const registerSW = async () => {
      try {
        setState(prev => ({ ...prev, isInstalling: true }))
        
        const registration = await navigator.serviceWorker.register(swUrl)
        
        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration,
          isInstalling: false,
        }))

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, updateAvailable: true }))
              }
            })
          }
        })

        // Check for already available update
        if (registration.waiting) {
          setState(prev => ({ ...prev, updateAvailable: true }))
        }

      } catch (error) {
        setState(prev => ({
          ...prev,
          isInstalling: false,
          error: error instanceof Error ? error.message : 'Failed to register service worker',
        }))
      }
    }

    registerSW()
  }, [swUrl, state.isSupported])

  const updateServiceWorker = () => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' })
    }
  }

  const unregister = async () => {
    if (state.registration) {
      const success = await state.registration.unregister()
      if (success) {
        setState(prev => ({ ...prev, isRegistered: false, registration: undefined }))
      }
      return success
    }
    return false
  }

  return {
    ...state,
    updateServiceWorker,
    unregister,
  }
}