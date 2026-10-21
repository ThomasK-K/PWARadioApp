// src/state/persistentState.ts
export function saveAppState() {
  // Save important state to sessionStorage
  const stateToSave = {
    counterValue: localStorage.getItem('counterValue'),
    countdownTime: sessionStorage.getItem('countdownTime'),
    // Add other state you want to preserve
  }
  
  sessionStorage.setItem('app_state_before_update', JSON.stringify(stateToSave))
}

export function restoreAppState() {
  const savedState = sessionStorage.getItem('app_state_before_update')
  
  if (savedState) {
    try {
      const parsedState = JSON.parse(savedState)
      
      // Restore saved state
      if (parsedState.counterValue) {
        localStorage.setItem('counterValue', parsedState.counterValue)
      }
      
      if (parsedState.countdownTime) {
        sessionStorage.setItem('countdownTime', parsedState.countdownTime)
      }
      
      // Clean up
      sessionStorage.removeItem('app_state_before_update')
      
      return true
    } catch (e) {
      console.error('Failed to restore app state', e)
    }
  }
  
  return false
}