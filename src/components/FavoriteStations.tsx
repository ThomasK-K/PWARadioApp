//
//
// FavoriteStations.tsx
import { useState } from "react";
import type { RadioStation } from "../types/types";
import { StreamList } from "./StreamList";
import "../styles/FavoriteStations.css";

interface FavoriteStationsProps {
  stations: RadioStation[];
  favoriteNames: string[];
  onToggleFavorite: (stationName: string) => void;
}

const FavoriteStations: React.FC<FavoriteStationsProps> = ({
  stations,
  favoriteNames,
  onToggleFavorite,
}) => {
  const [selectedStation, setSelectedStation] = useState<RadioStation>();
  const favorites = stations.filter((station) => favoriteNames.includes(station.name));

  if (selectedStation) {
    return <StreamList station={selectedStation} onBack={() => setSelectedStation(undefined)} />;
  }

  if (favorites.length === 0) {
    return <p className="favorites-empty">Noch keine Favoriten. Markiere Sender mit dem Stern.</p>;
  }

  return (
    <div className="favorites-list">
      <ul className="favorites-grid">
        {favorites.map((station) => (
          <li className="favorite-tile" key={station.name}>
            <button
              className="favorite-tile-open"
              type="button"
              onClick={() => setSelectedStation(station)}
            >
              {station.imageUrl ? (
                <img src={station.imageUrl} alt="" className="favorite-tile-image" />
              ) : (
                <span className="favorite-tile-placeholder" aria-hidden="true">
                  {station.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="favorite-tile-name">{station.name}</span>
            </button>
            <button
              className="favorite-tile-remove"
              type="button"
              aria-label={`${station.name} aus Favoriten entfernen`}
              onClick={() => onToggleFavorite(station.name)}
            >
              <span className="material-icons">star</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoriteStations;