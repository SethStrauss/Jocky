import React, { useState } from 'react';
import { Artist, Event } from '../types';
import './BookArtistModal.css';

interface BookArtistModalProps {
  onClose: () => void;
  onBook: (selectedArtists: string[], selectedEvents: string[], mode: 'interest' | 'booking') => void;
  artists: Artist[];
  events: Event[];
}

const BookArtistModal: React.FC<BookArtistModalProps> = ({ onClose, onBook, artists, events }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [mode, setMode] = useState<'interest' | 'booking'>('interest');
  
  const [venueFilter, setVenueFilter] = useState('all');
  const [dancefloorFilter, setDancefloorFilter] = useState('all');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [poolSearchQuery, setPoolSearchQuery] = useState('');
  const [marketplaceSearchQuery, setMarketplaceSearchQuery] = useState('');
  const [artistTypeFilter, setArtistTypeFilter] = useState('all');
  const [musicTypeFilter, setMusicTypeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const toggleEvent = (eventId: string) => {
    setSelectedEvents(prev =>
      prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
    );
  };

  const toggleArtist = (artistId: string) => {
    setSelectedArtists(prev =>
      prev.includes(artistId) ? prev.filter(id => id !== artistId) : [...prev, artistId]
    );
  };

  const handleNext = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    onBook(selectedArtists, selectedEvents, mode);
  };

  const poolArtists = artists
    .filter(artist => artist.id === '1' || artist.id === '3')
    .filter(artist =>
      artist.name.toLowerCase().includes(poolSearchQuery.toLowerCase()) ||
      artist.genres.some(g => g.toLowerCase().includes(poolSearchQuery.toLowerCase()))
    );

  const marketplaceArtists = artists
    .filter(artist => artist.id !== '1' && artist.id !== '3')
    .filter(artist => {
      const matchesSearch = artist.name.toLowerCase().includes(marketplaceSearchQuery.toLowerCase()) ||
                           artist.genres.some(g => g.toLowerCase().includes(marketplaceSearchQuery.toLowerCase()));
      const matchesType = artistTypeFilter === 'all' || artist.type.toLowerCase() === artistTypeFilter.toLowerCase();
      const matchesGenre = musicTypeFilter === 'all' || 
                          artist.genres.some(g => g.toLowerCase().includes(musicTypeFilter.toLowerCase()));
      const matchesLocation = locationFilter === 'all' || artist.location === locationFilter;
      
      return matchesSearch && matchesType && matchesGenre && matchesLocation;
    });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="wizard-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wizard-header">
          <h2 className="wizard-title">Book artist</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="wizard-steps">
          <div 
            className={`wizard-step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="step-number">1</div>
            <div className="step-label">Events</div>
          </div>
          
          <div 
            className={`wizard-step ${currentStep === 2 ? 'active' : ''}`}
            onClick={() => currentStep === 2 && setCurrentStep(2)}
          >
            <div className="step-number">2</div>
            <div className="step-label">Invite artists</div>
          </div>
        </div>

        <div className="wizard-content">
          {currentStep === 1 && (
            <div className="step-content">
              <div className="venue-filters">
                <div className="filter-group">
                  <label>Venue</label>
                  <select value={venueFilter} onChange={(e) => setVenueFilter(e.target.value)}>
                    <option value="all">All venues</option>
                    <option value="sturehof">Sturehof</option>
                    <option value="surreal">The Surreal Hotel</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Dancefloor</label>
                  <select value={dancefloorFilter} onChange={(e) => setDancefloorFilter(e.target.value)}>
                    <option value="all">All floors</option>
                    <option value="main">Main Dining</option>
                  </select>
                </div>
              </div>

              <div className="events-table-scroll">
                <table className="events-table">
                  <thead>
                    <tr>
                      <th className="col-check"></th>
                      <th className="col-event">Event</th>
                      <th className="col-venue">Venue</th>
                      <th className="col-date">Date</th>
                      <th className="col-time">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map(event => (
                      <tr key={event.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedEvents.includes(event.id)}
                            onChange={() => toggleEvent(event.id)}
                          />
                        </td>
                        <td className="event-name-cell">{event.name || 'Untitled Event'}</td>
                        <td>
                          <div className="venue-cell">
                            <div className="venue-name">{event.venue || 'No venue'}</div>
                            <div className="venue-floor">{event.danceFloor || ''}</div>
                          </div>
                        </td>
                        <td>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td>{event.startTime} - {event.endTime}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="step-content artists-step">
              {/* Mode Selection */}
              <div className="mode-tabs">
                <button
                  className={`mode-tab ${mode === 'interest' ? 'active' : ''}`}
                  onClick={() => setMode('interest')}
                >
                  Interest check
                </button>
                <button
                  className={`mode-tab ${mode === 'booking' ? 'active' : ''}`}
                  onClick={() => setMode('booking')}
                >
                  Booking request
                </button>
              </div>

              {/* Artist Pool Section */}
              <div className="artist-section">
                <div className="section-header">
                  <h3>Artist Pool</h3>
                  <span className="count">{poolArtists.length} artists</span>
                </div>

                <div className="search-box">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search your artists..."
                    value={poolSearchQuery}
                    onChange={(e) => setPoolSearchQuery(e.target.value)}
                  />
                </div>

                <div className="artists-list">
                  {poolArtists.map(artist => (
                    <div 
                      key={artist.id} 
                      className={`artist-card ${selectedArtists.includes(artist.id) ? 'selected' : ''}`}
                      onClick={() => toggleArtist(artist.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedArtists.includes(artist.id)}
                        readOnly
                      />
                      <div className="artist-avatar">{artist.name.charAt(0)}</div>
                      <div className="artist-info">
                        <div className="artist-name">{artist.name}</div>
                        <div className="artist-genres">{artist.genres.join(', ')}</div>
                      </div>
                      <div className="artist-status"></div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Marketplace Section */}
              <div className="artist-section marketplace-section">
                <div className="section-header">
                  <h3>Marketplace</h3>
                  <span className="count">{marketplaceArtists.length} artists</span>
                </div>

                <div className="search-box">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search marketplace..."
                    value={marketplaceSearchQuery}
                    onChange={(e) => setMarketplaceSearchQuery(e.target.value)}
                  />
                </div>

                <div className="marketplace-filters">
                  <select value={artistTypeFilter} onChange={(e) => setArtistTypeFilter(e.target.value)}>
                    <option value="all">Type of artist</option>
                    <option value="dj">DJ</option>
                    <option value="producer">Producer</option>
                  </select>

                  <select value={musicTypeFilter} onChange={(e) => setMusicTypeFilter(e.target.value)}>
                    <option value="all">Type of music</option>
                    <option value="house">House</option>
                    <option value="techno">Techno</option>
                  </select>

                  <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                    <option value="all">Location</option>
                    <option value="Stockholm">Stockholm</option>
                  </select>
                </div>

                <div className="artists-list">
                  {marketplaceArtists.map(artist => (
                    <div 
                      key={artist.id} 
                      className={`artist-card ${selectedArtists.includes(artist.id) ? 'selected' : ''}`}
                      onClick={() => toggleArtist(artist.id)}
                    >
                      <input
                        type="checkbox"
                        checked={selectedArtists.includes(artist.id)}
                        readOnly
                      />
                      <div className="artist-avatar">{artist.name.charAt(0)}</div>
                      <div className="artist-info">
                        <div className="artist-name">{artist.name}</div>
                        <div className="artist-genres">{artist.genres.join(', ')}</div>
                      </div>
                      <div className="artist-status"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="wizard-footer">
          {currentStep > 1 && (
            <button className="btn-back" onClick={handleBack}>Back</button>
          )}
          <div style={{flex: 1}}></div>
          {currentStep < 2 ? (
            <button 
              className="btn-next" 
              onClick={handleNext}
              disabled={selectedEvents.length === 0}
            >
              Next step
            </button>
          ) : (
            <button 
              className="btn-create" 
              onClick={handleSubmit}
              disabled={selectedArtists.length === 0}
            >
              {mode === 'interest' ? 'Send interest check' : 'Send booking request'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookArtistModal;
