import React, { useEffect, useState } from "react";
import "../styles/PlayerControl.css";
import { useRecoilState } from "recoil";
import { selectedMpdUrlState } from "../state/mpdUrls";
import { radioModeState } from "../state/radioMode";
import { useAudioPlayer } from "../hooks/useAudioPlayer";
import { songUpdateInterval } from "../state/songInterval";
import { safeGetItem } from "../utils/storageUtils";
import { actStream } from "../state/actStream";

// Default placeholder album art
const DEFAULT_ALBUM_ART = "https://placehold.co/300x300?text=No+Album+Art";

// --- Helper Components ---

interface IconButtonProps {
  icon: string;
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  icon,
  label,
  onPress,
  disabled,
}) => (
  <div className="control-button">
    <button
      className="button-icon"
      onClick={onPress}
      disabled={disabled}
      aria-label={label}
    >
      <i className="material-icons">{icon}</i>
    </button>
    <span className="button-label">{label}</span>
  </div>
);

export const PlayerControl: React.FC = () => {
  const [selectedUrl] = useRecoilState(selectedMpdUrlState);
  const [radioMode] = useRecoilState(radioModeState);
  const [songInterval] = useRecoilState(songUpdateInterval);
  const [actStreamState] = useRecoilState(actStream);
  const [volume, setVolume] = useState(() => {
    return safeGetItem<number>("volume", 50);
  });
  const [isLoading, setIsLoading] = useState(false);
  const [songData, setSongData] = useState<{
    title: string;
    artist: string;
    album: string;
    albumName: string;
  } | null>(null);
  const [playerState, setPlayerState] = useState<{
    bitrate: string;
    state: string;
    volume: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { play, pause, stop, currentUrl, error: audioError } = useAudioPlayer();

  useEffect(() => {
    let intervalId: number | undefined;

    const getCurrentSong = async () => {
      if (!selectedUrl) return;

      try {
        // Fetch current song data
        const response = await fetch(`${selectedUrl}/currentsong`, {
          method: "GET",
        });
        const res = await response.json();
        setSongData(res.data);

        // Fetch player state
        const response1 = await fetch(`${selectedUrl}`, {
          method: "GET",
        });
        const res1 = await response1.json();
        const { bitrate, state, volume } = res1.data;
        setError(null);
        setPlayerState({ bitrate, state, volume });
        setVolume(volume || 50);
      } catch (error) {
        console.error("Error fetching song data:", error);
        setError("Fehler beim Laden der Song-Informationen");
      }
    };

    // Initial fetch
    getCurrentSong();

    // Setup interval for updates
    intervalId = window.setInterval(
      getCurrentSong,
      songInterval * 1000 || 5000
    );

    // Cleanup function
    return () => {
      if (intervalId) window.clearInterval(intervalId);
    };
  }, [selectedUrl, songInterval]);

  // Save volume to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("volume", JSON.stringify(volume));
  }, [volume]);

  const handleAction = async (action: string) => {
    setIsLoading(true);
    setError(null);
    try {
      if (radioMode === "mpd" && selectedUrl) {
        await fetch(`${selectedUrl}/steuerung?command=${action}`, {
          method: "GET",
        });
      } else if (radioMode === "radio" && currentUrl) {
        // Handle web audio control
        if (action === "play") {
          play(currentUrl);
        } else if (action === "pause") {
          pause();
        } else if (action === "stop") {
          stop();
        }
      }
    } catch (e) {
      setError("Fehler bei der Steuerung");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVolume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    setVolume(v);
    setIsLoading(true);
    setError(null);
    try {
      if (radioMode === "mpd" && selectedUrl) {
        await fetch(`${selectedUrl}/setvol?vol=${v}`, { method: "GET" });
      } else if (radioMode === "radio") {
        // Adjust audio element volume here (would need to extend useAudioPlayer)
      }
    } catch (e) {
      setError("Fehler beim Setzen der Lautstärke");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="player-container">
      <h2 className="player-title">Musiksteuerung</h2>

      {songData && (
        <div className="player-info">
          <div className="player-song-info">
            <p>
              <strong>{radioMode}</strong> Player
            </p>
            <img
              src={songData.album || DEFAULT_ALBUM_ART}
              alt={`Album Art: ${songData.albumName || "Unknown Album"}`}
              className="player-album-art"
              onError={(e) => {
                (e.target as HTMLImageElement).src = DEFAULT_ALBUM_ART;
              }}
            />
            <p className="player-song-album">
              Album: {songData.albumName || "Unbekannt"}
            </p>
            <p className="player-song-title">
              {songData.artist || "Unbekannter Künstler"} -{" "}
              {songData.title || "Unbekannter Titel"}
            </p>
          </div>
        </div>
      )}

      {playerState && (
        <div className="player-status">
          Status: {playerState.state || "Unbekannt"}
        </div>
      )}

      <div className="player-controls">
        <IconButton
          icon="play_arrow"
          label="Play"
          onPress={() => handleAction("play")}
          disabled={isLoading}
        />
        <IconButton
          icon="pause"
          label="Pause"
          onPress={() => handleAction("pause")}
          disabled={isLoading}
        />
        <IconButton
          icon="stop"
          label="Stop"
          onPress={() => handleAction("stop")}
          disabled={isLoading}
        />
      </div>

      <div className="volume-control">
        <i className="material-icons">volume_down</i>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolume}
          step="1"
          aria-label="Lautstärke"
        />
        <i className="material-icons">volume_up</i>
        <span className="volume-value">{volume}</span>
      </div>
      {selectedUrl && (
        <div>
          <div className="player-url">URL: {selectedUrl}</div>
          <div className="player-stream">Stream: {actStreamState}</div>
        </div>
      )}
      {playerState?.bitrate && (
        <div className="player-bitrate">Bitrate: {playerState.bitrate}</div>
      )}

      {(error || audioError) && (
        <div className="player-error">{error || audioError}</div>
      )}
    </div>
  );
};

// Web-only player component for direct streaming
export const WebRadioPlayer: React.FC<{ stationUrl?: string }> = ({
  stationUrl,
}) => {
  const [volume, setVolume] = useState(() => {
    return safeGetItem<number>("volume", 50);
  });
  const [error, setError] = useState<string | null>(null);
  const {
    isPlaying,
    isLoading: audioIsLoading,
    play,
    pause,
    stop,
    currentUrl,
    error: audioError,
  } = useAudioPlayer();

  useEffect(() => {
    localStorage.setItem("volume", JSON.stringify(volume));
  }, [volume]);

  const handleAction = (action: string) => {
    setError(null);
    try {
      if (action === "play" && stationUrl) {
        play(stationUrl);
      } else if (action === "pause") {
        pause();
      } else if (action === "stop") {
        stop();
      }
    } catch (e) {
      setError("Fehler bei der Steuerung");
    }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    setVolume(v);
    // Audio volume implementation would be added here
  };

  return (
    <div className="player-container">
      <h2 className="player-title">Web Radio Player</h2>

      <div className="player-status">
        Status: {isPlaying ? "Playing" : audioIsLoading ? "Loading" : "Stopped"}
      </div>

      <div className="player-controls">
        <IconButton
          icon="play_arrow"
          label="Play"
          onPress={() => handleAction("play")}
          disabled={audioIsLoading || !stationUrl}
        />
        <IconButton
          icon="pause"
          label="Pause"
          onPress={() => handleAction("pause")}
          disabled={!isPlaying}
        />
        <IconButton
          icon="stop"
          label="Stop"
          onPress={() => handleAction("stop")}
          disabled={!isPlaying && !audioIsLoading}
        />
      </div>

      <div className="volume-control">
        <i className="material-icons">volume_down</i>
        <input
          type="range"
          className="volume-slider"
          min="0"
          max="100"
          value={volume}
          onChange={handleVolume}
          step="1"
          aria-label="Lautstärke"
        />
        <i className="material-icons">volume_up</i>
        <span className="volume-value">{volume}</span>
      </div>

      {currentUrl && (
        <div className="player-url">Aktueller Stream: {currentUrl}</div>
      )}

      {(error || audioError) && (
        <div className="player-error">{error || audioError}</div>
      )}
    </div>
  );
};
