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

interface PlaylistProps {
  playlists: PlaylistType[];
  favoriteStreams: RadioStream[];
  onToggleFavorite: (stream: RadioStream) => void;
}

const result = {
  success: true,
  data: [
    {
      file: "tidal:track:6369964:92472696:92472705",
      title: "Alphatier",
      artist: "Adam Angst",
      album: "Neintology",
      time: "175",
      duration: 175,
    },
    {
      file: "tidal:track:6369964:92472696:92479999",
      title: "What do you want from live",
      artist: "Tubes",
      album: "Live",
      time: "175",
      duration: 175,
    },
    {
      file: "tidal:track:6369964:92472696:92478888",
      title: "hells bells",
      artist: "acdc",
      album: "ballbraeker",
      time: "175",
      duration: 175,
    },
  ],
};

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

  const handleSuche = async () => {
    setDoSuche(true);
    let apiUrl = "";
          console.log("suche ...", value, queryCategory);

    if (queryCategory !== ""){
      if (queryCategory === "album") {
        apiUrl = `${selectedUrl}/searchbyalbum?${queryCategory}=${value}`;
      } else if (queryCategory === "title") {
        apiUrl = `${selectedUrl}/searchbytitle?${queryCategory}=${value}`;
      }
      else {
        apiUrl = `${selectedUrl}/search?${queryCategory}=${value}`;
      }
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log("suche ...", value, queryCategory, data);
    }
  };

  const handlePlaylistSelect = (playlist: PlaylistType) => {
    console.log("Ausgewählte Playlist:", playlist);
    setSelectedPlaylist(playlist);
  };

  const setList = (checked: boolean, index: number) => {
    var newList = [];

    if (checked) // add to playlist
    {
      newList.push(result.data[index]);

      const track = result.data[index];
      setSelectedTracks((prev) => [
        ...prev,
        { ...track, name: track.title, url: track.file },
      ]);
    } else {
      const track = result.data[index];
      setSelectedTracks((prev) =>
        prev.filter((itm) => itm.file !== track.file),
      );
    }
    console.log("toggle:", checked, selectedTracks);
  };

  const handleBackToStations = () => {
    setSelectedPlaylist(null);
  };

  const sucheItem = (
    <div className="station-list-header">
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
            // className="pl-input"
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
                  <span className="material-icons">{"play_arrow"}66</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <ul className="searchresult-container">
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
        {result.data.map((itm, index) => (
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
                <span>{itm.artist}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Playlist;
