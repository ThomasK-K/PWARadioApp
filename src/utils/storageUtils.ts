/**
 * Utility functions to safely manage localStorage data
 */

/**
 * Safely gets an item from localStorage and parses it as JSON
 * @param key The key to retrieve from localStorage
 * @param defaultValue Default value to return if key doesn't exist or parsing fails
 * @returns The parsed value or defaultValue if parsing fails
 */
export function safeGetItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item === null) return defaultValue;
    
    return JSON.parse(item) as T;
  } catch (e) {
    // If parsing fails, remove the invalid item and return the default
    console.warn(`Failed to parse localStorage item "${key}". Removing invalid data.`, e);
    localStorage.removeItem(key);
    return defaultValue;
  }
}

/**
 * Safely sets an item in localStorage after stringifying it
 * @param key The key to use in localStorage
 * @param value The value to store (will be JSON stringified)
 */
export function safeSetItem(key: string, value: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to store item in localStorage with key "${key}"`, e);
  }
}

/**
 * Cleans up localStorage by removing any items that cannot be parsed as valid JSON
 */
export function cleanupInvalidStorageItems(): void {
  const itemsToCheck = [
    'theme', 
    'colorScheme', 
    'notifications', 
    'mpdUrls',
    'selectedMpdUrl',
    'radioMode',
    'songUpdateInterval'
  ];
  
  itemsToCheck.forEach(key => {
    try {
      const item = localStorage.getItem(key);
      if (item !== null) {
        // Attempt to parse the item
        JSON.parse(item);
      }
    } catch (e) {
      // Remove invalid items
      console.warn(`Removing invalid localStorage item "${key}"`);
      localStorage.removeItem(key);
    }
  });
}
