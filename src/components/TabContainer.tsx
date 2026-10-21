import { useState } from 'react';
import type { ReactNode } from 'react';
import '../styles/TabContainer.css';

// Interface für Tab-Daten
export interface TabData {
  id: string;
  label: string;
  content: ReactNode;
  icon?: string;
  data?: any; // Optionales Datenfeld für zusätzliche Informationen
}

interface TabContainerProps {
  tabs: TabData[];
  defaultTab?: string;
  onTabChange?: (tabId: string) => void;
}

const TabContainer: React.FC<TabContainerProps> = ({ 
  tabs, 
  defaultTab,
  onTabChange
}) => {
  const [activeTabId, setActiveTabId] = useState<string>(
    defaultTab || (tabs.length > 0 ? tabs[0].id : '')
  );

  const handleTabClick = (tabId: string) => {
    setActiveTabId(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  };

  return (
    <div className="tab-container">
      <div className="tab-navigation" role="tablist" aria-label="Anwendungs-Tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTabId === tab.id ? 'active' : ''}`}
            role="tab"
            aria-selected={activeTabId === tab.id}
            aria-controls={`tab-panel-${tab.id}`}
            id={`tab-${tab.id}`}
            onClick={() => handleTabClick(tab.id)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span className="tab-label">{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="tab-content">
        {tabs.map(tab => (
          <div
            key={tab.id}
            id={`tab-panel-${tab.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${tab.id}`}
            className={`tab-panel ${activeTabId === tab.id ? 'active' : ''}`}
            hidden={activeTabId !== tab.id}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabContainer;
