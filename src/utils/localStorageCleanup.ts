import { useEffect } from 'react';

/**
 * Hook zur Bereinigung von localStorage bei App-Start
 * Wird einmal beim App-Start ausgeführt, um ungültige localStorage-Einträge zu entfernen
 */
export function useLocalStorageCleanup() {
  useEffect(() => {
    console.log('Bereinige localStorage...');
    
    try {
      // Liste der Schlüssel, die wir überprüfen wollen
      const keysToCheck = [
        'selectedMpdUrl',
        'mpdUrls',
        'activeTab',
        'count',
        'theme',
        'notifications',
        'colorScheme',
        'countdown-time'
      ];
      
      // Überprüfe und bereinige jeden Schlüssel
      for (const key of keysToCheck) {
        try {
          const value = localStorage.getItem(key);
          
          // Überspringen, wenn der Schlüssel nicht existiert
          if (!value) continue;
          
          // Versuche den Wert als JSON zu parsen
          try {
            JSON.parse(value);
            // Wenn kein Fehler auftritt, ist der Wert gültiges JSON
          } catch (parseError) {
            // Wenn es ein String ist, der wie eine URL aussieht, formatiere ihn korrekt
            if (typeof value === 'string' && (
                value.startsWith('http://') || 
                value.startsWith('https://') ||
                value.includes('192.168.') ||
                value.includes('localhost')
            )) {
              console.log(`Korrigiere ungültigen JSON-Wert für ${key}:`, value);
              localStorage.setItem(key, JSON.stringify(value));
            } else {
              // Andernfalls lösche den ungültigen Wert
              console.log(`Lösche ungültigen localStorage-Wert für ${key}:`, value);
              localStorage.removeItem(key);
            }
          }
        } catch (error) {
          console.error(`Fehler beim Überprüfen des Schlüssels ${key}:`, error);
        }
      }
      
      console.log('localStorage-Bereinigung abgeschlossen');
    } catch (error) {
      console.error('Fehler bei der localStorage-Bereinigung:', error);
    }
  }, []); // Leer-Array bedeutet, dieser Code läuft nur beim ersten Rendern
}
