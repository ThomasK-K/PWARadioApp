import React, { useState } from "react";
import "../styles/StationList.css";
import type { Playlist, RadioStation } from "../types/types";
import { createPlaylist, deletePlaylist } from "../utils/playlistUtils";
import { useRecoilState } from "recoil";
import { selectedMpdUrlState } from "../state/mpdUrls";
import { ConfirmModal } from "./ConfirmModal";

interface StationProps {
  stations: Playlist[];
  onStationSelect: (station: RadioStation) => void;
  onBack: () => void;
  onStationDelete: (station: Playlist) => void;
  onStationAdded: () => void;
}

export const StationList: React.FC<StationProps> = ({
  stations,
  onStationSelect,
  onStationDelete,
  onStationAdded,
}) => {
  const [doPlHandling, setDoPlaylistHandling] = useState<Boolean>(false);
  const [plName, setPlName] = useState<string>("");
  const [uriScheme, setUriScheme] = useState<string>("tidal");
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(true);
  const [selectedStation, setSelectedStation] = useState<Playlist | null>(null);

  const [selectedUrl] = useRecoilState(selectedMpdUrlState);

  const handleDeleteStation = async (station: Playlist) => {
    console.log("Deleting station:", station.url);
    await deletePlaylist(selectedUrl, station.url);
    setConfirmModalOpen(false);
    onStationDelete(station);
  };
  const onDeleteStation = async (station: Playlist) => {
    setSelectedStation(station);
    setConfirmModalOpen(true);
  };

  const handleAddStation = async (name: string, uriScheme: string) => {
    if (!name || !uriScheme) {
      console.error("Name und Typ müssen angegeben werden");
      return;
    }
    try {
      const ret = await createPlaylist(selectedUrl, name, uriScheme);

      if (ret?.ok) {
        onStationAdded();
        setPlName("");
        setDoPlaylistHandling(false);
      } else {
        console.error(
          "Fehler beim Erstellen der Playlist:",
          ret?.statusText ?? "Keine Serverantwort",
        );
      }
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Station:", name);
    }
  };

  const handlePlaylist = () => {
    console.log("handlePLaylist ....");
    setDoPlaylistHandling(true);
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
              <button
                onClick={() => handleAddStation(plName, uriScheme)}
                className="url-button"
              >
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
                // onClick={() => onStationSelect(station)}
                // onKeyDown={(event) => {
                //   if (
                //     event.target === event.currentTarget &&
                //     (event.key === "Enter" || event.key === " ")
                //   ) {
                //     event.preventDefault();
                //     onStationSelect(station);
                //   }
                // }}
                tabIndex={0}
              >
                <div className="station-content">
                  <div
                    className="station-logo-container"
                    onClick={() => onStationSelect(station)}
                  >
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
                  <div
                    className="station-name"
                    onClick={() => onStationSelect(station)}
                  >
                    {station.name}
                  </div>
                  <button
                    onClick={() => onDeleteStation(station)}
                    className="action-button delete"
                    aria-label="URL löschen"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </div>
        )}
      </ul>
      {confirmModalOpen ? (
        <ConfirmModal
          open={!!selectedStation}
          title="PLaylist löschen?"
          message={`Möchten Sie die Playlist "${selectedStation?.name}" wirklich löschen?`}
          onResult={(result) => {
            if (result && selectedStation) {
              handleDeleteStation(selectedStation);
              setConfirmModalOpen(false);
            }
            setSelectedStation(null);
          }}
        />
      ) : null}
    </div>
  );
};
