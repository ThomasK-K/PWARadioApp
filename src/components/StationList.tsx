import React from "react";
import "../styles/StationList.css";
import type { RadioStation } from "../types/types";

interface StationProps {
  stations: RadioStation[];
  onStationSelect: (station: RadioStation) => void;
}

export const StationList: React.FC<StationProps> = ({
  stations,
  onStationSelect
}) => {
  return (
    <div className="station-list">
      <ul className="station-container">
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
      </ul>
    </div>
  );
};
