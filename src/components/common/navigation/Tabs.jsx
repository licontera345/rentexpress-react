import { useCallback, useEffect, useState } from 'react';
import { clampTabIndex } from '../../../utils/componentUtils';

// Componente Tabs que define la interfaz y organiza la lógica de esta vista.

function Tabs({ tabs = [], defaultTab = 0 }) {
  const clampIndex = useCallback((index) => {
    return clampTabIndex(index, tabs.length);
  }, [tabs.length]);

  const [activeTab, setActiveTab] = useState(() => clampIndex(defaultTab));

  useEffect(() => {
    queueMicrotask(() => setActiveTab(clampIndex(defaultTab)));
  }, [clampIndex, defaultTab]);

  return (
    <div className="tabs">
      <div className="tabs-header">
        {tabs.map((tab, index) => (
          <button
            key={tab.id ?? tab.label ?? `tab-${index}`}
            className={`tab-button ${activeTab === index ? 'active' : ''}`}
            onClick={() => setActiveTab(index)}
            type="button"
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="tabs-content">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

export default Tabs;
