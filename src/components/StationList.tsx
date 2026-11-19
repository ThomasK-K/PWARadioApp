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
  const handlePlaylist = () => {
    console.log("handlePLaylist ....");
    setDoPlaylistHandling(true);
  };
  const handlecreatePlaylist = () => {
    console.log("cretate Playlist", plName);
  };
  return (
    <div className="station-list">
      <ul className="station-container">
        <li key={0} className="station-item" onClick={() => handlePlaylist()}>
          <div className="station-content">
            <div className="station-logo-container"></div>
            <div className="station-name">Playlist anlegen</div>
          </div>
        </li>
        {doPlHandling ? (
          <div className="stream-list-header">
            <button
              className="back-button"
              onClick={() => {
                setDoPlaylistHandling(false);
              }}
              aria-label="Zurück"
            >
              <span className="material-icons">arrow_back</span>
            </button>
            <h3>Neue Playlist</h3>
            <div className="url-input-container">
              <input
                type="text"
                value={plName}
                onChange={(e) => setPlName(e.target.value)}
                placeholder="Gib einen Namen ein"
                className="url-input"
              />
              <button onClick={handlecreatePlaylist} className="url-button">
                {"Hinzufügen"}
              </button>
            </div>
          </div>
        ) : (
          stations.map((station) => (
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
          ))
        )}
      </ul>
    </div>
  );
};
