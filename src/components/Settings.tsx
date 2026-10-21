import { useState, useEffect } from "react";
import "../styles/Settings.css";
import { useRecoilState } from "recoil";
import { mpdUrlsState, selectedMpdUrlState } from "../state/mpdUrls";
import { radioModeState } from "../state/radioMode";
import { songUpdateInterval } from "../state/songInterval";
import { safeGetItem, safeSetItem } from "../utils/storageUtils";

const Settings: React.FC = () => {
  const [mpdUrls, setMpdUrls] = useRecoilState(mpdUrlsState);
  const [radioMode, setRadioMode] = useRecoilState(radioModeState);
  const [selectedUrl, setSelectedUrl] = useRecoilState(selectedMpdUrlState);
  const [updateInterval, setUpdateInterval] =
    useRecoilState(songUpdateInterval);

  const [theme, setTheme] = useState<"light" | "dark" | "system">(() => {
    return safeGetItem<"light" | "dark" | "system">("theme", "system");
  });

  const [notifications, setNotifications] = useState<boolean>(() => {
    return safeGetItem<boolean>("notifications", false);
  });
  
  // MPD URL Management
  const [editingUrl, setEditingUrl] = useState<string>("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  // URL-Funktionen
  const handleAddUrl = () => {
    if (!editingUrl.trim()) return;
    
    if (editingIndex !== null) {
      // Aktualisieren
      const newUrls = [...mpdUrls];
      newUrls[editingIndex] = editingUrl;
      setMpdUrls(newUrls);
      setEditingIndex(null);
    } else {
      // Neu hinzufügen
      setMpdUrls([...mpdUrls, editingUrl]);
    }
    setEditingUrl("");
  };
  
  const handleSelectUrl = (url: string) => {
    setSelectedUrl(url);
  };
  
  const handleEditUrl = (url: string, index: number) => {
    setEditingUrl(url);
    setEditingIndex(index);
  };
  
  const handleDeleteUrl = (index: number) => {
    const newUrls = [...mpdUrls];
    newUrls.splice(index, 1);
    setMpdUrls(newUrls);
    
    // Wenn die aktuell ausgewählte URL gelöscht wurde
    if (selectedUrl === mpdUrls[index]) {
      setSelectedUrl(newUrls[0] || "");
    }
  };

  // Farbschemata
  const [colorScheme, setColorScheme] = useState<"blue" | "green" | "purple">(
    () => {
      return safeGetItem<"blue" | "green" | "purple">("colorScheme", "blue");
    }
  );

  useEffect(() => {
    safeSetItem("theme", theme);
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    safeSetItem("notifications", notifications);
  }, [notifications]);

  useEffect(() => {
    safeSetItem("colorScheme", colorScheme);
    applyColorScheme(colorScheme);
  }, [colorScheme]);

  const applyTheme = (selectedTheme: "light" | "dark" | "system") => {
    const root = document.documentElement;

    if (selectedTheme === "system") {
      // System-Einstellung verwenden
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      root.dataset.theme = prefersDark ? "dark" : "light";
    } else {
      root.dataset.theme = selectedTheme;
    }
  };

  const applyColorScheme = (scheme: "blue" | "green" | "purple") => {
    const root = document.documentElement;
    root.dataset.colorScheme = scheme;
  };

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Dieser Browser unterstützt keine Desktop-Benachrichtigungen");
      return;
    }

    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      setNotifications(true);
      new Notification("Benachrichtigungen aktiviert", {
        body: "Du wirst nun über wichtige Ereignisse informiert.",
      });
    } else {
      setNotifications(false);
    }
  };

  return (
    <div className="settings-component">
      <h2>Einstellungen</h2>

      <div className="settings-input-container">
        <label className="settings-label">Player Mode:</label>
        <div className="settings-dropdown">
          <select
            value={radioMode}
            onChange={(e) => setRadioMode(e.target.value)}
            className="settings-select"
          >
            <option value="mpd">MPD Player</option>
            <option value="local">Lokal</option>
          </select>
        </div>
      </div>

      {radioMode === "mpd" && (
        <>
          <div className="settings-group mpd-url-settings">
            <h3>MPD Server URLs</h3>
            <div className="url-input-container">
              <input
                type="text"
                value={editingUrl}
                onChange={(e) => setEditingUrl(e.target.value)}
                placeholder="Gib eine MPD Server URL ein"
                className="url-input"
              />
              <button 
                onClick={handleAddUrl} 
                className="url-button"
              >
                {editingIndex !== null ? "Aktualisieren" : "Hinzufügen"}
              </button>
            </div>
            
            <div className="url-list">
              {mpdUrls.length > 0 ? (
                mpdUrls.map((url, index) => (
                  <div 
                    key={index} 
                    className={`url-item ${url === selectedUrl ? 'selected' : ''}`}
                  >
                    <div className="url-content" onClick={() => handleSelectUrl(url)}>
                      <span className="url-text">{url}</span>
                      {url === selectedUrl && <span className="url-active-badge">Aktiv</span>}
                    </div>
                    <div className="url-actions">
                      <button 
                        onClick={() => handleEditUrl(url, index)}
                        className="action-button edit"
                        aria-label="URL bearbeiten"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteUrl(index)}
                        className="action-button delete"
                        aria-label="URL löschen"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-urls">Keine URLs hinzugefügt</div>
              )}
            </div>
          </div>
          
          <div className="settings-group">
            <h3>Aktualisierungsintervall</h3>
            <div className="setting-item">
              <label htmlFor="update-interval">Song-Informationen aktualisieren (Sekunden)</label>
              <input 
                id="update-interval"
                type="number" 
                min="1"
                max="60"
                value={updateInterval}
                onChange={(e) => setUpdateInterval(Math.max(1, Math.min(60, parseInt(e.target.value) || 5)))}
                className="interval-input"
              />
            </div>
          </div>
        </>
      )}

      <div className="settings-group">
        <h3>Darstellung</h3>
        <div className="setting-item">
          <label htmlFor="theme-select">Design-Modus</label>
          <select
            id="theme-select"
            value={theme}
            onChange={(e) =>
              setTheme(e.target.value as "light" | "dark" | "system")
            }
          >
            <option value="light">Hell</option>
            <option value="dark">Dunkel</option>
            <option value="system">System</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Farbschema</label>
          <div className="color-options">
            <button
              className={`color-option blue ${
                colorScheme === "blue" ? "active" : ""
              }`}
              onClick={() => setColorScheme("blue")}
              aria-label="Blaues Farbschema"
            />
            <button
              className={`color-option green ${
                colorScheme === "green" ? "active" : ""
              }`}
              onClick={() => setColorScheme("green")}
              aria-label="Grünes Farbschema"
            />
            <button
              className={`color-option purple ${
                colorScheme === "purple" ? "active" : ""
              }`}
              onClick={() => setColorScheme("purple")}
              aria-label="Lila Farbschema"
            />
          </div>
        </div>
      </div>

      <div className="settings-group">
        <h3>Benachrichtigungen</h3>

        <div className="setting-item">
          <label htmlFor="notifications-toggle">
            Benachrichtigungen erlauben
          </label>
          <button
            id="notifications-toggle"
            className={`toggle-button ${notifications ? "active" : ""}`}
            onClick={requestNotificationPermission}
            aria-pressed={notifications}
          >
            {notifications ? "Aktiviert" : "Deaktiviert"}
          </button>
        </div>
      </div>

      <div className="settings-group">
        <h3>Über die App</h3>
        <p className="about-app">
          Radio Streaming App ist eine Progressive Web App (PWA), die offline
          funktioniert und auf dem Homescreen installiert werden kann.
        </p>
        <p className="version-info">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default Settings;
