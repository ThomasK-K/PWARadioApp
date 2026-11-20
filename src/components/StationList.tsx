import React, { useState } from "react";
import "../styles/StationList.css";
import type { Playlist, RadioStation } from "../types/types";

interface StationProps {
  stations: Playlist[];
  onStationSelect: (station: RadioStation) => void;
  onBack: () => void;
}

export const StationList: React.FC<StationProps> = ({
  stations,
  onStationSelect,
}) => {
  const [doPlHandling, setDoPlaylistHandling] = useState<Boolean>(false);
  const [plName, setPlName] = useState<string>("");
  const [uriScheme, setUriScheme] = useState<string>("");
  const handlePlaylist = () => {
    console.log("handlePLaylist ....");
    setDoPlaylistHandling(true);
  };
  const handlecreatePlaylist = () => {
    console.log("create Playlist", plName, uriScheme);
  };
  return (
    <div className="station-list">
      <ul className="station-container">
        {doPlHandling ? (
          <div className="station-list-header">
            <button
              className="back-button"
              onClick={() => {
                setDoPlaylistHandling(false);
              }}
              aria-label="Zurück"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <h3></h3>
            <div className="pl-group">
              <div className="pl-item">
                <span>Name: </span>
                <input
                  type="text"
                  value={plName}
                  onChange={(e) => setPlName(e.target.value)}
                  placeholder="Gib einen Namen ein"
                  // className="pl-input"
                />
              </div>
              <div className="pl-item">
                <span>Typ: </span>
                  <select
                    value={uriScheme}
                    onChange={(e) => setUriScheme(e.target.value)}
                  >
                    <option value="tidal">Tidal</option>
                    <option value="m3u">M3u Playlist</option>
                  </select>
              </div>
              <button onClick={handlecreatePlaylist} className="url-button">
                {"Hinzufügen"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <li
              key={0}
              className="station-item"
              onClick={() => handlePlaylist()}
            >
              <div className="station-content">
                <div className="station-logo-container"></div>
                <div className="station-name">Playlist anlegen</div>
              </div>
            </li>
            {stations.map((station) => (
              <li
                key={station.id}
                className="station-item"
                onClick={() => onStationSelect(station)}
                onKeyDown={(event) => {
                  if (
                    event.target === event.currentTarget &&
                    (event.key === "Enter" || event.key === " ")
                  ) {
                    event.preventDefault();
                    onStationSelect(station);
                  }
                }}
                tabIndex={0}
              >
                <div className="station-content">
                  <div className="station-logo-container">
                    {station.imageUrl ? (
                      <img
                        src={station.imageUrl}
                        alt={station.name}
                        className="station-logo"
                      />
                    ) : (
                      <div className="placeholder-logo"></div>
                    )}
                  </div>
                  <div className="station-name">{station.name}</div>
                </div>
              </li>
            ))}
          </div>
        )}
      </ul>
    </div>
  );
};
