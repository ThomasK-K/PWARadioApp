import { atom } from "recoil";
import { safeGetItem, safeSetItem } from "../utils/storageUtils";

// Standardwert für die MPD Server URLs
const DEFAULT_URLS = ['http://192.168.10.162/player', 'http://192.168.10.162:8000/player'];

// Atom für die Liste der MPD Server URLs
export const mpdUrlsState = atom<string[]>({
  key: "mpdUrlsState",
  default: DEFAULT_URLS,
  effects: [
    ({ setSelf, onSet }) => {
      // Lade gespeicherte URLs beim Start
      const savedUrls = safeGetItem("mpdUrls", DEFAULT_URLS);
      setSelf(savedUrls);
      
      // Speichere URLs bei Änderungen
      onSet((newUrls) => {
        safeSetItem("mpdUrls", newUrls);
      });
    },
  ],
});

// Atom für die aktuell ausgewählte URL
export const selectedMpdUrlState = atom<string>({
  key: "selectedMpdUrlState",
  default: DEFAULT_URLS[0],
  effects: [
    ({ setSelf, onSet }) => {
      // Lade gespeicherte Auswahl beim Start
      const savedUrl = safeGetItem<string>("selectedMpdUrl", DEFAULT_URLS[0]);
      setSelf(savedUrl);
      
      // Speichere Auswahl bei Änderung
      onSet((newUrl) => {
        safeSetItem("selectedMpdUrl", newUrl);
      });
    },
  ],
});
