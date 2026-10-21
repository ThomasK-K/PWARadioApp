export interface RadioStation {
    id: string;
    name: string;
    imageUrl?: string; // Optional Bild-URL für die Station
    streams?: RadioStream[]; // Optional streams array for the station
}

export interface RadioStream {
    id?: string; // Optional ID for the stream
    name: string;
    url: string;
}
