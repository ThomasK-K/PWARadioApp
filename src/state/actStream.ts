import { atom } from "recoil";
import { safeGetItem, safeSetItem } from "../utils/storageUtils";

// Atom für das Songupdate-Intervall
export const actStream = atom<string>({
  key: "actStream",
  default: '', // Standardintervall in Sekunden
  effects: [
    ({ onSet, setSelf }) => {
      // Lade gespeichertes Intervall beim Start
      const stream = safeGetItem<string>("actStream", '');
      setSelf(stream);

      // Speichere Intervall bei Änderungen
      onSet((stream) => {
        safeSetItem("actStream", stream);
      });
    },
  ],
});
