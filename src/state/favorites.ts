import { atom } from 'recoil';
import { safeGetItem, safeSetItem } from "../utils/storageUtils";

// Atom FavoriteStreams
export const favoritesState = atom<string>({
  key: 'favoritesState',
  default: '', // Standardwert 
  effects: [
    ({ setSelf, onSet }) => {
      // Lade gespeicherte URLs beim Start
      const savedFavorites = safeGetItem("favorites", '');
      setSelf(savedFavorites);
      
      // Speichere Favoritess bei Änderungen
      onSet((newFavorites) => {
        safeSetItem("favorites", newFavorites);
      });
    },
  ],
});
