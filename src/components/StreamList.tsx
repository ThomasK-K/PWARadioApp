import React, { useEffect, useState } from "react";
import "../styles/StreamList.css";
import type { RadioStation, RadioStream } from "../types/types";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { useRecoilState } from "recoil";
import { selectedMpdUrlState } from "../state/mpdUrls";
import { radioModeState } from "../state/radioMode";
// import { actStream } from "../state/actStream";
import { fetchMPDStreams } from "../data/fetchMPDPlaylists";

interface StreamListProps {
  station?: RadioStation;
  onBack: () => void;
}

export const StreamList: React.FC<StreamListProps> = ({ station, onBack }) => {
  const [streams, setStreams] = useState<RadioStream[]>([]);
  const [selectedUrl] = useRecoilState(selectedMpdUrlState);
  const [radioMode] = useRecoilState(radioModeState);
  // const [setActStreamState] = useRecoilState(actStream);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isPlaying, currentUrl, play } = useAudioPlayer();

  useEffect(() => {
    if (!station?.name || !selectedUrl) return;

    // Lade Playlists vom MPD-Server, wenn sich die URL ändert
    const loadStreams = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl = `${selectedUrl}/playlistcontent?name=${station.name}`;
        console.log("Loading streams from:", apiUrl);
        const streams = await fetchMPDStreams(apiUrl);
        setStreams(streams);
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

  const handlePlayPress = async (stream: RadioStream) => {
    try {
      if (!selectedUrl) return;

      if (radioMode === "local") {
        await play(stream.url);
      } else if (radioMode === "mpd") {
        if (currentUrl !== stream.url) {
          // setActStreamState(stream.name);

          await fetch(`${selectedUrl}/playsong?name=${stream.url}`, {
            method: "GET",
          });
        }
      }
    } catch (error) {
      console.error("Error handling play press:", error);
    }
  };

  return (
    <div className="stream-list-container">
      <div className="stream-list-header">
        <button className="back-button" onClick={onBack} aria-label="Zurück">
          <span className="material-icons">arrow_back</span>
        </button>
        <h2>{station?.name || "Streams"}</h2>
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
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
