import React, { useState } from "react";
import "../styles/Sender.css";
import { StationList } from "./StationList";
import { StreamList } from "./StreamList";
import type { RadioStation, RadioStream } from "../types/types";

interface SenderProps {
  stations: RadioStation[];
  favoriteStreams: RadioStream[];
  onToggleFavorite: (stream: RadioStream) => void;
}

const SenderList: React.FC<SenderProps> = (props) => {
  const { stations, favoriteStreams, onToggleFavorite } = props;
  const [selectedStation, setSelectedStation] = useState<RadioStation | undefined>(undefined);
  
  // console.log("Stations: ", stations, favoriteNames);

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
        <StreamList
          station={selectedStation}
          onBack={handleBackToStations}
          favoriteStreams={favoriteStreams}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <StationList
          stations={stations}
          // favoriteStreams={favoriteStreams}
          onStationSelect={handleStationSelect}
          // onToggleFavorite={onToggleFavorite}
        />
      )}
    </div>
  );
};

export default SenderList;
