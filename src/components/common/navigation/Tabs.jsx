import { useEffect, useState } from 'react';
import './Tabs.css';

function Tabs({ tabs = [], defaultTab = 0 }) {
  const clampTabIndex = (index) => {
    if (tabs.length === 0) {
      return 0;
    }
    return Math.min(Math.max(index, 0), tabs.length - 1);
  };

  const [activeTab, setActiveTab] = useState(() => clampTabIndex(defaultTab));

  useEffect(() => {
    setActiveTab(clampTabIndex(defaultTab));
  }, [defaultTab, tabs.length]);

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
