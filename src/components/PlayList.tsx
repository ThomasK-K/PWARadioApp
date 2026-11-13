import React, { useState } from "react";
import "../styles/Sender.css";

import type { Playlist as PlaylistType, RadioStream } from "../types/types";
import TrackList from "./TrackList";

interface PlaylistProps {
  playlists: PlaylistType[];
  favoriteStreams: RadioStream[];
  onToggleFavorite: (stream: RadioStream) => void;
}

const Playlist: React.FC<PlaylistProps> = ({
  playlists,
  favoriteStreams,
  onToggleFavorite,
}) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(null);

  const handlePlaylistSelect = (playlist: PlaylistType) => {
    console.log("Ausgewählte Playlist:", playlist);
    setSelectedPlaylist(playlist);
  };

  const handleBackToStations = () => {
    setSelectedPlaylist(null);
  };

  return (
    <div className="sender-component">
      {selectedPlaylist ? (
        <TrackList
          selectedplaylist={selectedPlaylist}
          onBack={handleBackToStations}
          favoriteStreams={favoriteStreams}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <div className="station-list">
          <ul className="station-container">
            {playlists.map((playlist) => (
              <li
                key={playlist.id ?? playlist.name}
                className="station-item"
                onClick={() => handlePlaylistSelect(playlist)}
                onKeyDown={(event) => {
                  if (
                    event.target === event.currentTarget &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    handlePlaylistSelect(playlist);
                  }
                }}
                tabIndex={0}
              >
                <div className="station-content">
                  <div className="station-name">{playlist.name}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Playlist;
