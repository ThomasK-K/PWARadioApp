import { atom } from 'recoil';
import { safeGetItem, safeSetItem } from "../utils/storageUtils";

// Atom für radio mode
export const radioModeState = atom<string>({
  key: 'radioModeState',
  default: 'mpd', // Standardwert für den Radio-Modus
  effects: [
    ({ setSelf, onSet }) => {
      // Lade gespeicherte URLs beim Start
      const mode = safeGetItem<string>('radioMode', 'mpd');
      setSelf(mode);

      // Speichere URLs bei Änderungen
      onSet((mode) => {
        safeSetItem('radioMode', mode);
      });
    },
  ],
});

// // Atom für die aktuell ausgewählte URL
// export const setRadioModeState = atom<string>({
//   key: 'radioModeState',
//   default:'mpd',
//   effects: [
//     ({ setSelf, onSet }) => {
//       // Lade gespeicherte Auswahl beim Start
//       AsyncStorage.getItem('radioMode')
//         .then((mode) => {
//           if (mode) {
//             setSelf(mode);
//           }
//         })
//         .catch(console.error);

//       // Speichere Auswahl bei Änderung
//       onSet((mode) => {
//         AsyncStorage.setItem('selectedMpdUrl', mode)
//           .catch(console.error);
//       });
//     },
//   ],
// });
