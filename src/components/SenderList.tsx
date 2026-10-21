import React, { useState } from "react";
import "../styles/Sender.css";
import { StationList } from "./StationList";
import { StreamList } from "./StreamList";
import type { RadioStation } from "../types/types";

interface SenderProps {
  stations: RadioStation[];
  favoriteNames: string[];
  onToggleFavorite: (stationName: string) => void;
}

const SenderList: React.FC<SenderProps> = (props) => {
  const { stations, favoriteNames, onToggleFavorite } = props;
  const [selectedStation, setSelectedStation] = useState<RadioStation | undefined>(undefined);
  
  console.log("Stations: ", stations);

  // Handler für die Auswahl einer Station
  const handleStationSelect = (station: RadioStation) => {
    console.log("Ausgewählte Station:", station);
    setSelectedStation(station);
  };

  // Handler für die Rückkehr zur Stationsliste
  const handleBackToStations = () => {
    setSelectedStation(undefined);
  };

  return (
    <div className="sender-component">
      {selectedStation ? (
        <StreamList station={selectedStation} onBack={handleBackToStations} />
      ) : (
        <StationList
          stations={stations}
          favoriteNames={favoriteNames}
          onStationSelect={handleStationSelect}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
};

export default SenderList;
