import React, { useState } from 'react';
import { Artist } from '../types';
import './ArtistsView.css';

// Mock artist data
const mockArtists: Artist[] = [
  {
    id: '1',
    name: 'AronChupa',
    type: 'DJ',
    location: 'Stockholm',
    genres: ['House', 'Techno'],
    about: 'Jag vill spela hos er eftersom den har en grym energi och passion för livemusik. Mitt mål är att skapa en oförglömlig kväll där publiken verkligen känner musiken. Hoppas på att få uppträda hos er!',
    status: 'pending',
    request: 'Jag vill spela hos er eftersom den har en grym energi och passion för livemusik.'
  },
  {
    id: '2',
    name: 'Gilly',
    type: 'DJ',
    location: 'Stockholm',
    genres: ['House', 'Disco'],
    about: 'Jag vill spela på er klubb eftersom den har en fantastisk atmosfär och en publik som verkligen uppskattar musik. Ert engagemang för liveakter och energi på dansgolvet gör det till en perfekt plats för mitt sound. Jag älskar att skapa en unik upplevelse för varje spelning, och jag är säker på att vi tillsammans kan skapa en magisk kväll fylld med bra musik och härlig stämning. Ser fram emot möjligheten att få spela hos er!',
    status: 'pending'
  },
  {
    id: '3',
    name: 'Dj Terka',
    type: 'DJ',
    location: 'Stockholm',
    genres: ['Techno', 'Tech House', 'Drum & Bass', 'Future House', 'Garage'],
    about: 'Jag vill spela på er klubb eftersom den har en fantastisk atmosfär och en publik som verkligen uppskattar musik. Ert engagemang för liveakter och energi på dansgolvet gör det till en perfekt plats för mitt sound.',
    status: 'pending'
  }
];

const ArtistsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'requests'>('requests');
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [artists, setArtists] = useState<Artist[]>(mockArtists);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAccept = (artistId: string) => {
    setArtists(artists.map(a => 
      a.id === artistId ? { ...a, status: 'accepted' } : a
    ));
  };

  const handleDecline = (artistId: string) => {
    setArtists(artists.map(a => 
      a.id === artistId ? { ...a, status: 'declined' } : a
    ));
  };

  const pendingRequests = artists.filter(a => a.status === 'pending');
  const allArtistsList = activeTab === 'requests' ? pendingRequests : artists;

  return (
    <div className="artists-view">
      {/* Header */}
      <div className="artists-header">
        <div className="artists-header-left">
          <h1 className="artists-title">Artists</h1>
          
          <div className="artists-tabs">
            <button
              className={`tab-btn ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Artists
            </button>
            <button
              className={`tab-btn ${activeTab === 'requests' ? 'active' : ''}`}
              onClick={() => setActiveTab('requests')}
            >
              Requests
            </button>
          </div>
        </div>

        {activeTab === 'requests' && pendingRequests.length > 0 && (
          <button className="btn-accept-all">Accept all</button>
        )}
      </div>

      <div className="artists-content">
        {/* Artist List */}
        <div className="artist-list-panel">
          <input
            type="text"
            placeholder="Search"
            className="artist-search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="artist-cards">
            {activeTab === 'requests' ? (
              // Requests view
              pendingRequests.map(artist => (
                <div key={artist.id} className="artist-request-card">
                  <div className="request-header">
                    <div className="artist-avatar">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                    <h3 className="artist-name">{artist.name}</h3>
                  </div>

                  <p className="artist-request-text">{artist.about}</p>

                  <div className="request-actions">
                    <button 
                      className="btn-decline"
                      onClick={() => handleDecline(artist.id)}
                    >
                      Decline
                    </button>
                    <button 
                      className="btn-accept"
                      onClick={() => handleAccept(artist.id)}
                    >
                      Accept
                    </button>
                  </div>
                </div>
              ))
            ) : (
              // All artists view
              <div className="empty-state">
                <p>Artist list coming soon...</p>
              </div>
            )}
          </div>
        </div>

        {/* Artist Details Panel */}
        <div className="artist-details-panel">
          {activeTab === 'all' && (
            <div className="top-actions">
              <p className="find-artist-text">Can't find the right artist for your event?</p>
              <div className="action-buttons">
                <button className="btn-request-artist">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z"/>
                  </svg>
                  Request artist
                </button>
                <button className="btn-add-artist">
                  <span>+</span>
                  Add artist
                </button>
              </div>
            </div>
          )}

          {selectedArtist ? (
            <div className="artist-detail-content">
              <div className="artist-avatar-large">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <h2>{selectedArtist.name}</h2>
              <p className="artist-location">{selectedArtist.location}</p>
              
              <div className="genres-section">
                <h3>Genres</h3>
                <div className="genre-tags">
                  {selectedArtist.genres.map((genre, i) => (
                    <span key={i} className="genre-tag">{genre}</span>
                  ))}
                </div>
              </div>

              <div className="about-section">
                <h3>About</h3>
                <p>{selectedArtist.about}</p>
              </div>
            </div>
          ) : (
            <div className="empty-detail">
              <p>Select an artist to see details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistsView;
