// FavoriteStations.tsx
import { useState } from "react";
import type { RadioStream } from "../types/types";
import "../styles/FavoriteStations.css";
import { playStream } from "../utils/playStream";

interface FavoriteStreamsProps {
  favoriteStreams: RadioStream[];
  onToggleFavorite: (stream: RadioStream) => void;
}

const FavoriteStreams: React.FC<FavoriteStreamsProps> = ({
  favoriteStreams,
  onToggleFavorite,
}) => {
  const [, setSelectedStream] = useState<RadioStream>();
  // const favorites = streams.filter((stream) => favoriteStreams.includes(stream.name));

  // if (selectedStream) {
  //   return (
  //     <StreamList
  //       station={selectedStream}
  //       onBack={() => setSelectedStream(undefined)}
  //       favoriteStreams={favoriteStreams}
  //       onToggleFavorite={onToggleFavorite}
  //     />
  //   );
  // }
  const handlePlayPress = async (stream: RadioStream) => {
    try {
      setSelectedStream(stream);
      playStream(stream, "mpd");
    } catch (error) {
      console.error("Error handling play press:", error);
    }
  };

  if (favoriteStreams?.length === 0) {
    return (
      <p className="favorites-empty">
        Noch keine Favoriten. Markiere Sender mit dem Stern.
      </p>
    );
  }

  return (
    <div className="favorites-list">
      <ul className="favorites-grid">
        {favoriteStreams?.map((stream) => (
          <li className="favorite-tile" key={stream.name}>
            <button
              className="favorite-tile-open"
              type="button"
              onClick={() => handlePlayPress(stream)}
            >
              {stream.url ? (
                <img src={stream.url} alt="" className="favorite-tile-image" />
              ) : (
                <span className="favorite-tile-placeholder" aria-hidden="true">
                  {stream.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="favorite-tile-name">{stream.name}</span>
            </button>
            <button
              className="favorite-tile-remove"
              type="button"
              aria-label={`${stream.name} aus Favoriten entfernen`}
              onClick={() => onToggleFavorite(stream)}
            >
              <span className="material-icons">star</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteStreams;
