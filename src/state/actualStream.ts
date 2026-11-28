import { atom } from "recoil";
import { safeGetItem, safeSetItem } from "../utils/storageUtils";

// Atom für das Songupdate-Intervall
export const actualStreamState  = atom<string>({
  key: "actualStream",
  default: '', // Standardintervall in Sekunden
  effects: [
    ({ onSet, setSelf }) => {
      // Lade gespeichertes Intervall beim Start
      const stream = safeGetItem<string>("actualStream", '');
      setSelf(stream);

      // Speichere Intervall bei Änderungen
      onSet((stream) => {
        safeSetItem("actualStream", stream);
      });
    },
  ],
});
