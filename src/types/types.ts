export interface RadioStream {
  id?: string; // Optional ID for the stream
  name: string;
  url: string;
}
interface Artist {
  name: string;
  uri: string;
}

interface Album {
  name: string;
  uri: string;
  artists: Artist[];
  date: string; // Release date in ISO format
}

export interface TrackPlaylist {
  name: string;
  url: string;
  artists: Artist[];
  album: Album;
  track_no: number;
  disk_no: number;
  date: string; // Release date in ISO format
  length: number; // Length in milliseconds
}

export interface Playlist {
  id?: string;
  name: string;
  url: string;
  imageUrl?: string; // Optional Bild-URL für die Station
}

export interface RadioStation {
  id?: string;
  name: string;
  url: string;
  uriScheme?: string; // Typ der Playlist (z.B. "m3u", "tidal")
  imageUrl?: string; // Optional Bild-URL für die Station
  streams?: RadioStream[]; // Optional streams array for the station
}
export interface Track {
  id?: string;
  name: string;
  url: string;
  file?: string;
  title: string;
  album?: string;
  artist?: Artist;
  artists?: Artist[];
}

export interface Tracklist {
  tracks?: TrackPlaylist[];
}
