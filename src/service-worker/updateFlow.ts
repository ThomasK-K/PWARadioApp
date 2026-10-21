
import { registerSW } from 'virtual:pwa-register'
import { saveAppState } from '../state/persistantState'

export function setupUpdateFlow() {
  // Register the Service Worker with a periodic check for updates
  // Use immediate updates for better compatibility with different URLs
  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      // Show update notification to user
      showUpdateNotification(updateSW)
    },
    onOfflineReady() {
      console.log('App ready to work offline')
    },
    onRegisteredSW(swUrl, registration) {
      console.log('Service Worker registered at:', swUrl)
      
      // Force update check immediately
      if (registration) {
        registration.update().catch(console.error)
        
        // Handle cross-origin service worker issues
        const updateInterval = setInterval(() => {
          registration.update().catch(error => {
            console.error('SW update error:', error)
            clearInterval(updateInterval)
          })
        }, 60 * 1000) // Check every minute
      }
    },
    onRegisterError(error) {
      console.error('Service Worker registration error:', error)
    }
  })
  
  // Optional: Implement your own periodic update check if needed
   setInterval(() => updateSW(true), 10 * 1000);

  return updateSW
}
function showUpdateNotification(updateSW: () => Promise<void>) {
  // Create notification element
  const notification = document.createElement('div')
  notification.className = 'update-notification'
  notification.innerHTML = `
    <div class="update-content">
      <p>Eine neue Version der App ist verfügbar!</p>
      <button id="update-button">Jetzt aktualisieren</button>
      <button id="dismiss-button">Später</button>
    </div>
  `
  
  // Add to DOM
  document.body.appendChild(notification)
  
  // Add event listeners
document.getElementById('update-button')?.addEventListener('click', () => {
  // Save current state before updating
  saveAppState()
  
  // Apply the update
  updateSW()
  notification.remove()
})
  document.getElementById('dismiss-button')?.addEventListener('click', () => {
    notification.remove()
  })
}