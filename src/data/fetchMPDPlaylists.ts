import type { RadioStation, RadioStream } from '../types/types';

// Beispiel für Mopidy/MPD REST API Antwort:
// [
//   { "name": "Playlist 1", "tracks": [ { "title": "Song 1", "file": "http://..." }, ... ] },
//   ...
// ]

export async function fetchMPDPlaylists1(apiUrl: string): Promise<RadioStation[]> {
  const response = await fetch(apiUrl);
  const playlists = await response.json();
  // Passe das Mapping ggf. an das echte API-Format an!
  return playlists.map((pl: any, idx: number) => ({
    id: String(idx + 1),
    name: pl.name || `Playlist ${idx + 1}`,
    streams: (pl.tracks || []).map((track: any, tidx: number) => ({
      id: `${idx + 1}-${tidx + 1}`,
      name: track.title || track.file || `Track ${tidx + 1}`,
      url: track.file,
      // Optional: bitrate/format, falls vorhanden
    }))
  }));
}

export async function fetchMPDPlaylists(apiUrl: string): Promise<RadioStation[]> {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      console.error(`Fehler beim Abrufen der Playlists: ${response.status}`);
      return []; // Leeres Array zurückgeben bei Fehler
    }
    
    const playlists = await response.json();
    
    // Verschiedene API-Antwortformate behandeln
    if (playlists.data && Array.isArray(playlists.data)) {
      // Format: { data: [...] }
      return playlists.data.map((pl: any, idx: number) => ({
        id: String(idx + 1),
        name: pl || `Playlist ${idx + 1}`
      }));
    } else if (Array.isArray(playlists)) {
      // Format: [...] (direktes Array)
      return playlists.map((pl: any, idx: number) => ({
        id: String(idx + 1),
        name: typeof pl === 'object' ? (pl.name || `Playlist ${idx + 1}`) : pl || `Playlist ${idx + 1}`
      }));
    } else {
      console.warn("Unerwartetes API-Format:", playlists);
      return [];
    }
  } catch (error) {
    console.error("Fehler beim Abrufen der Playlists:", error);
    return []; // Leeres Array zurückgeben bei Fehler
  }
} 

export async function fetchMPDStreams(apiUrl: string): Promise<RadioStream[]> {
  const response = await fetch(apiUrl);
  const streams = await response.json();
  
  return streams.data.map((str: any, idx: number) => ({
    id: String(idx + 1),
    name: str.name|| `Stream ${idx + 1}`,
    url: str.url || `http://example.com/stream${idx + 1}`,  
  })
  );
} 

export async function playMPDStreams(apiUrl: string): Promise<RadioStream[]> {
  const response = await fetch(apiUrl);
  const streams = await response.json();
  return streams
  
} 
