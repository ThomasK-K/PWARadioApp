import { atom } from "recoil";
import { safeGetItem, safeSetItem } from "../utils/storageUtils";

// Atom für das Songupdate-Intervall
export const songUpdateInterval = atom<number>({
  key: "songUpdateInterval",
  default: 10, // Standardintervall in Sekunden
  effects: [
    ({ onSet, setSelf }) => {
      // Lade gespeicherte intervall beim Start
      const interval = safeGetItem<number>("songUpdateInterval", 10);
      setSelf(interval);

      // Speichere Intervall bei Änderungen
      onSet((interval) => {
        safeSetItem("songUpdateInterval", interval);
      });
    },
  ],
});
