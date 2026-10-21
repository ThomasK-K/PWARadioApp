import type { RadioStation, RadioStream } from '../types/types';

// Einfache M3U-zu-Stationen-Parserfunktion
export function parseM3UToStations(m3u: string): RadioStation[] {
  const lines = m3u.split(/\r?\n/);
  const stations: RadioStation[] = [];
  let streamName = '';
  let streamUrl = '';
  let idCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('#EXTINF')) {
      // Beispiel: #EXTINF:-1,Deutschlandfunk - High Quality
      const nameMatch = line.match(/,(.*)/);
      streamName = nameMatch ? nameMatch[1].trim() : `Stream ${idCounter}`;
    } else if (line && !line.startsWith('#')) {
      streamUrl = line;
      // Versuche Sendernamen und Streamnamen zu trennen
      let stationName = streamName;
      let streamLabel = streamName;
      if (streamName.includes(' - ')) {
        const [station, stream] = streamName.split(' - ', 2);
        stationName = station.trim();
        streamLabel = stream.trim();
      }
      // Finde oder erstelle Station
      let station = stations.find(s => s.name === stationName);
      if (!station) {
        station = {
          id: `${idCounter}`,
          name: stationName,
          streams: [],
        };
        stations.push(station);
        idCounter++;
      }
      
      if (station && station.streams) {
        const stream: RadioStream = {
          id: `${station.id}-${station.streams.length + 1}`,
          name: streamLabel,
          url: streamUrl,
        };
        station.streams.push(stream);
      }
    }
  }
  return stations;
}
