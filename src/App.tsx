import { useState, useEffect } from "react";
import type { Playlist as PlaylistType, RadioStream } from "./types/types";
import "./App.css";
import type { TabData } from "./components/TabContainer";
import TabContainer from "./components/TabContainer";
import SenderList from "./components/SenderList";
import FavoriteStations from "./components/FavoriteStations";
import Settings from "./components/Settings";
import Playlist from "./components/PlayList";
import { PlayerControl } from "./components/PlayerControl";
import { fetchMPDPlaylists } from "../src/data/fetchMPDPlaylists";
import { useRecoilState } from "recoil";
import { selectedMpdUrlState } from "../src/state/mpdUrls";
import { useLocalStorageCleanup } from "../src/utils/localStorageCleanup";
import { safeGetItem, safeSetItem } from "./utils/storageUtils";
import "./styles/UpdateNotification.css";

function App() {
  // Bereinige localStorage beim App-Start
  useLocalStorageCleanup();

  // Prüfe die Online/Offline-Verbindung
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [newVersionAvailable, setNewVersionAvailable] =
    useState<boolean>(false);

  const [selectedUrl] = useRecoilState(selectedMpdUrlState);
  const [stations, setStations] = useState<PlaylistType[]>([]);
  const [playlists, setPlaylists] = useState<PlaylistType[]>([]);
  const [favoriteStreams, setFavoriteStreams] = useState<RadioStream[]>(
    safeGetItem<RadioStream[]>("favoriteStreams", []),
  );

  function filterByName<T extends { name: string }>(
    items: T[],
    name: string,
  ): T[] {
    return items.filter((item) => item.name === name);
  }
  const toggleFavorite = (stream: RadioStream) => {
    setFavoriteStreams(
      filterByName(favoriteStreams, stream.name).length > 0
        ? favoriteStreams.filter((s) => s.name !== stream.name)
        : [...favoriteStreams, stream],
    );
    safeSetItem(
      "favoriteStreams",
      filterByName(favoriteStreams, stream.name).length > 0
        ? favoriteStreams.filter((s) => s.name !== stream.name)
        : [...favoriteStreams, stream],
    );
  };

  useEffect(() => {
    console.log("App selectedUrl:", selectedUrl);
    if (!selectedUrl) {
      console.warn("Keine URL ausgewählt");
      return;
    }
    const loadStations = async () => {
      if (!selectedUrl) {
        console.warn("Keine URL ausgewählt");
        return;
      }

      try {
        const apiUrl = `${selectedUrl}/getPlaylistsByType?type=m3u`;
        console.log("Versuche Playlists zu laden von:", apiUrl);
        const response = await fetchMPDPlaylists(apiUrl);
        setStations(response);
      } catch (e) {
        console.error("Fehler beim Laden der Stationen:", e);
        setStations([]);
      }
    };

    const loadPlaylists = async () => {
      if (!selectedUrl) {
        console.warn("Keine URL ausgewählt");
        return;
      }

      try {
        const apiUrl = `${selectedUrl}/getPlaylistsByType?type=tidal`;
        console.log("Versuche Playlists zu laden von:", apiUrl);
        const response = await fetchMPDPlaylists(apiUrl);
        setPlaylists(response);
      } catch (e) {
        console.error("Fehler beim Laden der Playlists:", e);
        setPlaylists([]);
      }
    };

    try {
      loadStations();
      loadPlaylists();
    } catch (error) {
      console.error("Unerwarteter Fehler:", error);
    }
  }, [selectedUrl]);

  // Aktiver Tab
  const [activeTabId, setActiveTabId] = useState<string>(() => {
    return localStorage.getItem("activeTab") || "sender";
  });

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Überprüfe, ob eine PWA-Aktualisierung verfügbar ist
    window.addEventListener("sw-update-available", () => {
      setNewVersionAvailable(true);
    });

    // System-Farbschema änderungen überwachen
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme") === "system") {
        document.documentElement.dataset.theme = e.matches ? "dark" : "light";
      }
    };

    mediaQuery.addEventListener("change", handleThemeChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("sw-update-available", () => {
        setNewVersionAvailable(false);
      });

      mediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  // Speichere den aktiven Tab im LocalStorage
  useEffect(() => {
    localStorage.setItem("activeTab", activeTabId);
  }, [activeTabId]);

  useEffect(() => {
    localStorage.setItem("favoriteStations", JSON.stringify(favoriteStreams));
    // console.log('Gespeicherte Favoriten:', localStorage.getItem('favoriteStations')) // Debugging line to check if the favorites are being saved correctly
  }, [favoriteStreams]);

  const updateApp = () => {
    // Eine benutzerdefinierte Funktion, die den Service Worker aktualisiert
    window.location.reload();
  };

  // Tab-Definition
  const tabs: TabData[] = [
    {
      id: "tidal",
      label: "Tidal",
      content: (
        <Playlist
          playlists={playlists}
          favoriteStreams={favoriteStreams}
          onToggleFavorite={toggleFavorite}
        />
      ),
    },
    {
      id: "sender",
      label: "Sender",
      content: (
        <SenderList
          stations={stations}
          favoriteStreams={favoriteStreams}
          onToggleFavorite={toggleFavorite}
        />
      ),
    },
    {
      id: "favorites",
      label: "Favoriten",
      content: (
        <FavoriteStations
          favoriteStreams={favoriteStreams}
          onToggleFavorite={toggleFavorite}
        />
      ),
    },
    {
      id: "player",
      label: "Player",
      content: <PlayerControl />,
    },

    {
      id: "settings",
      label: "Einstellungen",
      content: <Settings />,
    },
  ];

  return (
    <div className="app-container">
      <header>
        <h1>Radio Streaming App</h1>
        <div className={`connection-status ${isOnline ? "online" : "offline"}`}>
          {isOnline ? "Online" : "Offline"}
        </div>
      </header>

      {newVersionAvailable && (
        <div className="update-banner">
          <p>Eine neue Version ist verfügbar!</p>
          <button onClick={updateApp} className="update-btn">
            Aktualisieren
          </button>
        </div>
      )}

      <TabContainer
        tabs={tabs}
        defaultTab={activeTabId}
        onTabChange={(tabId) => setActiveTabId(tabId)}
      />
    </div>
  );
}

export default App;
