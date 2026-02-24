import React, { useState } from 'react';
import './MarketplaceView.css';

interface MarketplaceArtist {
  id: string;
  name: string;
  type: string;
  location: string;
  image?: string;
}

const mockMarketplaceArtists: MarketplaceArtist[] = [
  { id: '1', name: 'The Black Flakes', type: 'Live artist', location: 'Stockholm' },
  { id: '2', name: 'Christoffer Biteus', type: 'Standup comedian, Quizmaster', location: 'Karlstad' },
  { id: '3', name: 'DJ Rock Ski', type: 'DJ', location: 'Hägersten' },
  { id: '4', name: 'Varas', type: 'Live artist', location: 'Stockholm, Göteborg' },
  { id: '5', name: 'Lucky Lou', type: 'Live artist', location: 'Stockholm' },
];

const MarketplaceView: React.FC = () => {
  const [artistType, setArtistType] = useState('');
  const [musicType, setMusicType] = useState('');
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="marketplace-view">
      <h1 className="marketplace-title">Marketplace</h1>

      {/* Filters */}
      <div className="marketplace-filters">
        <select 
          className="filter-select"
          value={artistType}
          onChange={(e) => setArtistType(e.target.value)}
        >
          <option value="">Type of artist</option>
          <option value="dj">DJ</option>
          <option value="live">Live artist</option>
          <option value="comedian">Comedian</option>
        </select>

        <select 
          className="filter-select"
          value={musicType}
          onChange={(e) => setMusicType(e.target.value)}
        >
          <option value="">Type of music</option>
          <option value="house">House</option>
          <option value="techno">Techno</option>
          <option value="disco">Disco</option>
        </select>

        <select 
          className="filter-select"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        >
          <option value="">Location</option>
          <option value="stockholm">Stockholm</option>
          <option value="goteborg">Göteborg</option>
          <option value="malmo">Malmö</option>
        </select>

        <div className="search-box">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>

      <div className="artist-count">470 artists</div>

      {/* Artist Grid */}
      <div className="marketplace-grid">
        {mockMarketplaceArtists.map(artist => (
          <div key={artist.id} className="marketplace-card">
            <div className="marketplace-card-image">
              {artist.image ? (
                <img src={artist.image} alt={artist.name} />
              ) : (
                <div className="placeholder-image">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="marketplace-card-info">
              <h3 className="artist-card-name">{artist.name}</h3>
              <p className="artist-card-type">{artist.type}</p>
              <p className="artist-card-location">{artist.location}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketplaceView;
