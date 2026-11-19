import React, { useEffect, useState } from "react";
import "../styles/StreamList.css";
import type { RadioStation, RadioStream } from "../types/types";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useRecoilState } from "recoil";
import { selectedMpdUrlState } from "../state/mpdUrls";
// import { radioModeState } from "../state/radioMode";
import { playPlaylist } from "../utils/playStream";

interface StreamListProps {
  station?: RadioStation;
  onBack: () => void;
  favoriteStreams: RadioStream[];
  onToggleFavorite: (stream: RadioStream) => void;
}

export const StreamList: React.FC<StreamListProps> = ({
  station,
  onBack,
  favoriteStreams,
  onToggleFavorite,
}) => {
  const [streams, setStreams] = useState<RadioStream[]>([]);
  const [selectedUrl] = useRecoilState(selectedMpdUrlState);
  // const [radioMode] = useRecoilState(radioModeState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPlaying, currentUrl } = useAudioPlayer();

  useEffect(() => {
    if (!station?.name || !selectedUrl) return;

    const loadStreams = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl = `${selectedUrl}/playlistcontent?name=${station.name}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        const parsedTracks = Array.isArray(data?.data)
          ? data.data.map((track: any, index: number) => ({
              id: String(index + 1),
              name:
                track.name || track.title || track.file || `Track ${index + 1}`,
              url: track.uri || track.file || track.url || "",
            }))
          : [];

        setStreams(parsedTracks);
      } catch (e) {
        console.error("Error loading streams:", e);
        setError("Fehler beim Laden der Streams");
        setStreams([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadStreams();
  }, [station?.name, selectedUrl]);

  const handlePlayPress = async (stream: RadioStream | string | undefined) => {
    try {
      if (!stream) return;
      // await playplaylist(stationName);
    } catch (error) {
      console.error("Error handling play press:", error);
    }
  };
  const handlePlayPlaylist = async (stationName: string | undefined) => {
    try {
      if (!stationName) return;
      await playPlaylist(stationName,selectedUrl);
    } catch (error) {
      console.error("Error handling play playlist:", error);
    }
  }

  return (
    <div className="stream-list-container">
      <div className="stream-list-header">
        <button className="back-button" onClick={onBack} aria-label="Zurück">
          <span className="material-icons">arrow_back</span>
        </button>

        <button
          className={"stream-button"}
          onClick={() => handlePlayPlaylist(station?.name)}
        >
          <h2>{station?.name || "Streams"}</h2>
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading-indicator">Lade Streams...</div>
      ) : (
        <ul className="stream-list">
          {streams.map((stream) => {
            const isCurrentlyPlaying = currentUrl === stream.url && isPlaying;

            return (
              <li key={stream.name} className="stream-item">
                <button
                  className={`stream-button ${
                    isCurrentlyPlaying ? "playing" : ""
                  }`}
                  onClick={() => handlePlayPress(stream)}
                  disabled={isLoading}
                >
                  <div className="stream-info">
                    <div className="stream-name">{stream.name}</div>
                  </div>
                  <div className="play-button">
                    {isLoading && currentUrl === stream.url ? (
                      <span className="material-icons">radio</span>
                    ) : (
                      <span className="material-icons">
                        {isCurrentlyPlaying ? "pause" : "play_arrow"}
                      </span>
                    )}
                  </div>
                </button>
                <button
                  className="favorite-toggle"
                  type="button"
                  aria-label={
                    favoriteStreams.some((s) => s.name === stream.name)
                      ? `${stream.name} aus Favoriten entfernen`
                      : `${stream.name} zu Favoriten hinzufügen`
                  }
                  aria-pressed={favoriteStreams.some(
                    (s) => s.name === stream.name,
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(stream);
                  }}
                >
                  <span className="material-icons">
                    {favoriteStreams.some((s) => s.name === stream.name)
                      ? "star"
                      : "star_border"}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
