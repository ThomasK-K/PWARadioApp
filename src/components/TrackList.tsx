import React, { useEffect, useState } from "react";
import type { Playlist, RadioStream, Track } from "../types/types";
import { useRecoilState } from "recoil";
import { selectedMpdUrlState } from "../state/mpdUrls";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { radioModeState } from "../state/radioMode";
import { playStream } from "../utils/playStream";

interface TracklistProps {
  selectedplaylist: Playlist;
  onBack: () => void;
  favoriteStreams: RadioStream[];
  onToggleFavorite: (stream: RadioStream) => void;
}

export const Tracklist: React.FC<TracklistProps> = ({
  selectedplaylist,
  onBack,
  favoriteStreams,
  onToggleFavorite,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [selectedUrl] = useRecoilState(selectedMpdUrlState);
  const [radioMode] = useRecoilState(radioModeState);
  const { isPlaying, currentUrl } = useAudioPlayer();

  useEffect(() => {
    if (!selectedplaylist?.name || !selectedUrl) return;

    const loadTracks = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const apiUrl = `${selectedUrl}/playlistcontent?name=${encodeURIComponent(selectedplaylist.name)}`;
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        const parsedTracks = Array.isArray(data?.data)
          ? data.data.map((track: any, index: number) => ({
              id: String(index + 1),
              name: track.name || track.title || track.file || `Track ${index + 1}`,
              url: track.url || track.file || "",
            }))
          : [];

        setTracks(parsedTracks);
      } catch (e) {
        console.error("Error loading tracks:", e);
        setError("Fehler beim Laden der Tracks");
        setTracks([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadTracks();
  }, [selectedplaylist?.name, selectedUrl]);

  const handlePlayPress = async (track: Track) => {
    try {
      if (!track.url) return;
      await playStream(track, radioMode);
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
        <h2>{selectedplaylist?.name || "Playlist"}</h2>
      </div>

      {error && <div className="error-message">{error}</div>}

      {isLoading ? (
        <div className="loading-indicator">Lade Streams...</div>
      ) : (
        <ul className="tracklist">
          {tracks.map((track) => {
            const isCurrentlyPlaying = currentUrl === track.url && isPlaying;

            return (
              <li key={track.id ?? track.name} className="track-item">
                <button
                  className={`stream-button ${
                    isCurrentlyPlaying ? "playing" : ""
                  }`}
                  onClick={() => handlePlayPress(track)}
                  disabled={isLoading}
                >
                  <div className="stream-info">
                    <div className="stream-name">{track.name}</div>
                  </div>
                  <div className="play-button">
                    {isLoading && currentUrl === track.url ? (
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
                    favoriteStreams.some((s) => s.name === track.name)
                      ? `${track.name} aus Favoriten entfernen`
                      : `${track.name} zu Favoriten hinzufügen`
                  }
                  aria-pressed={favoriteStreams.some(
                    (s) => s.name === track.name,
                  )}
                  onClick={(event) => {
                    event.stopPropagation();
                    onToggleFavorite(track);
                  }}
                >
                  <span className="material-icons">
                    {favoriteStreams.some((s) => s.name === track.name)
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

export default Tracklist;
