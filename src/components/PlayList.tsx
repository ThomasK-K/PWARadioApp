import React, { useState } from "react";
import "../styles/PlayList.css";
import { useRecoilState } from "recoil";
import { selectedMpdUrlState } from "../state/mpdUrls";
import type {
  Playlist as PlaylistType,
  RadioStream,
  Track,
} from "../types/types";
import TrackList from "./TrackList";
import { ConfirmModal } from "./ConfirmModal";
// import { deletePlaylist } from "../utils/playlistUtils";
import { playPlaylist } from "../utils/playStream";

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
  //  const [selectedUrl] = useRecoilState(selectedMpdUrlState);
  const [selectedUrl] = useRecoilState(selectedMpdUrlState);
  const [selectedPlaylist, setSelectedPlaylist] = useState<PlaylistType | null>(
    null,
  );
  const [doSuche, setDoSuche] = useState<Boolean>(false);
  const [queryCategory, setQueryCategory] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [selectedTracks, setSelectedTracks] = useState<Track[]>([]);
  const [tracklist, setTracklist] = useState<Track[]>([]);
  const [confirmModalOpen, setConfirmModalOpen] = useState<boolean>(true);
  const [selectedPlaylistToDelete, setSelectedPlaylistToDelete] =
    useState<PlaylistType | null>(null);

  const handleSuche = async () => {
    setDoSuche(true);
    let apiUrl = "";
    setTracklist([]);
    setSelectedTracks([]);
    if (queryCategory !== "") {
      if (queryCategory === "album") {
        apiUrl = `${selectedUrl}/searchbyalbum?${queryCategory}=${value}`;
      } else if (queryCategory === "title") {
        apiUrl = `${selectedUrl}/searchbytitle?${queryCategory}=${value}`;
      } else {
        apiUrl = `${selectedUrl}/search?${queryCategory}=${value}`;
      }
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const resp = await response.json();
      // add to playlist
      const tracks = resp.data as Track[];
      console.log("suche ...", value, queryCategory, tracks);
      setTracklist((prev) => [...prev, ...tracks]);
    }
  };
  // seletedTracks
  const handlePlaylistSelect = (playlist: PlaylistType) => {
    console.log("Ausgewählte Playlist:", playlist);
    setSelectedPlaylist(playlist);
  };

  const setList = (checked: boolean, index: number) => {
    const track = tracklist[index];
    if (!track) return;

    if (checked) {
      if (!track.file) return;
      const url = track.file;
      setSelectedTracks((prev) => [
        ...prev,
        { ...track, name: track.id ?? url, url },
      ]);
    } else {
      setSelectedTracks((prev) =>
        prev.filter((itm) => itm.file !== track.file),
      );
    }
    console.log("toggle:", checked, selectedTracks);
  };

  const handleBackToStations = () => {
    setSelectedPlaylist(null);
  };
  const handlePlayPlaylist = async (stationName: string | undefined) => {
    try {
      if (!stationName) return;
      await playPlaylist(stationName, selectedUrl);
    } catch (error) {
      console.error("Error handling play playlist:", error);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!selectedPlaylistToDelete) return;
    console.log("Deleting playlist:", selectedPlaylistToDelete.url);
    // await deletePlaylist(selectedUrl, selectedPlaylistToDelete.url);
    setConfirmModalOpen(false);
    // onDeletePlaylist(selectedPlaylistToDelete);
  };
  const onPlaylistToDelete = async (playlist: PlaylistType) => {
    setSelectedPlaylistToDelete(playlist);
    setConfirmModalOpen(true);
  };

  const sucheItem = (
    <div className="searchresult-container">
      <button
        className="back-button"
        onClick={() => {
          setDoSuche(false);
        }}
        aria-label="Zurück"
      >
        <span className="material-icons">arrow_back</span>
      </button>
      <div className="pl-group">
        <div className="pl-item">
          <span>Name: </span>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Gib einen Namen ein"
          />
        </div>
        <div className="pl-item">
          <span>Typ: </span>
          <select
            value={queryCategory}
            onChange={(e) => setQueryCategory(e.target.value)}
          >
            <option value="empty"></option>
            <option value="album">Album</option>
            <option value="title">Titel</option>
            <option value="artist">Artist</option>
          </select>
        </div>
        <button onClick={handleSuche} className="url-button">
          {"Suche!"}
        </button>
      </div>
       <div className="pl-group">

        {/* Button to add selected tracks to playlist */}

        <ul className="searchresult-container">
          {selectedTracks.length > 0 && (
            <button onClick={handleSuche} className="toPlaylist-button">
              {"Zu Playlist hinzufügen"}
            </button>
          )}
          <li>
            <div className="searchresult-row">
              <div className="checkbox-column">
                {/* <input type="checkbox" /> */}
              </div>
              <div>
                <strong>Titel</strong>
              </div>
              <div>
                <strong>Album</strong>
              </div>
              <div>
                <strong>Artist</strong>
              </div>
            </div>
          </li>
          {tracklist.length === 0 && (
            <li>
              <div className="searchresult-row">
                <div>Keine Ergebnisse gefunden</div>
              </div>
            </li>
          )}

          {tracklist.map((itm, index) => (
            <li key={index}>
              <div className="searchresult-row">
                <div className="checkbox-column">
                  <input
                    type="checkbox"
                    onChange={(e) => setList(e.target.checked, index)}
                  />
                </div>
                <div>
                  <span>{itm.title}</span>
                </div>
                <div>
                  <span>{itm.album}</span>
                </div>
                <div>
                  <span>
                    {typeof itm.artist === "string"
                      ? itm.artist
                      : itm.artist?.name}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  return (
    <div className="searchresult-container">
      {doSuche ? (
        sucheItem
      ) : selectedPlaylist ? (
        <TrackList
          selectedplaylist={selectedPlaylist}
          onBack={handleBackToStations}
          favoriteStreams={favoriteStreams}
          onToggleFavorite={onToggleFavorite}
        />
      ) : (
        <div className="station-list">
          <ul className="station-container">
            <li key={0} className="station-item" onClick={() => handleSuche()}>
              <div className="station-content">
                <div className="station-logo-container"></div>
                <div className="station-name">Suche ...</div>
              </div>
            </li>
            {playlists.map((playlist) => (
              <li
                key={playlist.id ?? playlist.name}
                className="station-item"
                tabIndex={0}
              >
                <div className="station-content">
                  <div
                    className="station-name"
                    onClick={() => handlePlaylistSelect(playlist)}
                  >
                    {playlist.name}
                  </div>
                  <span
                    className="material-icons"
                    onClick={() => handlePlayPlaylist(playlist.name)}
                  >
                    {"play_arrow"}
                  </span>
                  <button
                    onClick={() => onPlaylistToDelete(playlist)}
                    className="action-button delete"
                    aria-label="URL löschen"
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {confirmModalOpen ? (
        <ConfirmModal
          open={!!selectedPlaylistToDelete}
          title="PLaylist löschen?"
          message={`Möchten Sie die Playlist "${selectedPlaylistToDelete?.name}" wirklich löschen?`}
          onResult={(result) => {
            if (result && selectedPlaylistToDelete) {
              handleDeletePlaylist();
              setConfirmModalOpen(false);
            }
            setSelectedPlaylistToDelete(null);
          }}
        />
      ) : null}
    </div>
  );
};

export default Playlist;
