import React from 'react';
import './Navigation.css';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange, onLogout }) => {
  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-left">
          <div className="logo">JOCKY</div>
          
          <div className="nav-tabs">
            <button
              className={`nav-tab ${activeTab === 'events' ? 'active' : ''}`}
              onClick={() => onTabChange('events')}
            >
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Events
            </button>

            <button
              className={`nav-tab ${activeTab === 'artists' ? 'active' : ''}`}
              onClick={() => onTabChange('artists')}
            >
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              Artists
            </button>

            <button
              className={`nav-tab ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => onTabChange('requests')}
            >
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              Requests
            </button>

            <button
              className={`nav-tab ${activeTab === 'history' ? 'active' : ''}`}
              onClick={() => onTabChange('history')}
            >
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              History
            </button>

            <button
              className={`nav-tab ${activeTab === 'marketplace' ? 'active' : ''}`}
              onClick={() => onTabChange('marketplace')}
            >
              <svg className="nav-icon" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
              </svg>
              Marketplace
            </button>
          </div>
        </div>

        <div className="nav-right">
          <select className="venue-selector">
            <option>New Venue</option>
          </select>
          {onLogout && (
            <button className="btn-logout" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
