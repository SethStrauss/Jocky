import React, { useState } from 'react';
import { Event, Artist } from '../types';
import './CreateEventWizard.css';

interface CreateEventWizardProps {
  onClose: () => void;
  onCreate: (event: Event, selectedArtists?: string[], pdfFile?: File) => void;
  initialDate: Date;
  initialTime?: string;
  artists: Artist[];
}

const CreateEventWizard: React.FC<CreateEventWizardProps> = ({
  onClose,
  onCreate,
  initialDate,
  initialTime,
  artists
}) => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Event Details
  const [eventName, setEventName] = useState('');
  const [frequency, setFrequency] = useState<'single' | 'multiple'>('single');
  const [eventDate, setEventDate] = useState(initialDate.toISOString().split('T')[0]);
  const [startTime, setStartTime] = useState(initialTime || '19:00');
  const [endTime, setEndTime] = useState('22:00');
  const [venue, setVenue] = useState('Sturehof');
  const [danceFloor, setDanceFloor] = useState('Main Dining');
  const [amount, setAmount] = useState('5000');
  
  // Step 2: Invite Artists
  const [inviteMethod, setInviteMethod] = useState<'interest' | 'booking'>('interest');
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Step 3: Attach PDF
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = date.getDate();
    const suffix = day === 1 || day === 21 || day === 31 ? 'st' : 
                   day === 2 || day === 22 ? 'nd' : 
                   day === 3 || day === 23 ? 'rd' : 'th';
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return `${months[date.getMonth()]} ${day}${suffix}, ${date.getFullYear()}`;
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = () => {
    const newEvent: Event = {
      id: Date.now().toString(),
      name: eventName || 'Untitled Gig',
      date: new Date(eventDate),
      startTime,
      endTime,
      danceFloor,
      amount: parseFloat(amount) || 0,
      notes: '',
      frequency,
      status: inviteMethod === 'interest' ? 'open' : 'offered',
      openForRequests: inviteMethod === 'interest',
    };

    onCreate(newEvent, selectedArtists, uploadedFile || undefined);
  };

  const toggleArtist = (artistId: string) => {
    setSelectedArtists(prev => 
      prev.includes(artistId) 
        ? prev.filter(id => id !== artistId)
        : [...prev, artistId]
    );
  };

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genres.some(g => g.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0]);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="wizard-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="wizard-header">
          <h2 className="wizard-title">Create New Gig</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {/* Step Indicator */}
        <div className="wizard-steps">
          <div 
            className={`wizard-step ${currentStep === 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(1)}
          >
            <div className="step-number">1</div>
            <div className="step-label">Event details</div>
          </div>
          
          <div 
            className={`wizard-step ${currentStep === 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}
            onClick={() => setCurrentStep(2)}
          >
            <div className="step-number">2</div>
            <div className="step-label">Invite artists</div>
          </div>
          
          <div 
            className={`wizard-step ${currentStep === 3 ? 'active' : ''}`}
            onClick={() => setCurrentStep(3)}
          >
            <div className="step-number">3</div>
            <div className="step-label">Attach PDF</div>
          </div>
        </div>

        {/* Step Content */}
        <div className="wizard-content">
          {/* STEP 1: Event Details */}
          {currentStep === 1 && (
            <div className="step-content">
              <div className="form-row">
                <div className="form-group full-width">
                  <label className="form-label">Frequency</label>
                  <div className="radio-group-horizontal">
                    <label className="wizard-radio-label">
                      <input
                        type="radio"
                        checked={frequency === 'single'}
                        onChange={() => setFrequency('single')}
                      />
                      <span className="wizard-radio-text">Single gig</span>
                    </label>
                    <label className="wizard-radio-label">
                      <input
                        type="radio"
                        checked={frequency === 'multiple'}
                        onChange={() => setFrequency('multiple')}
                      />
                      <span className="wizard-radio-text">Multiple gigs</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Event name (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Friday Night Live"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Event date</label>
                <div className="date-display-wizard">
                  <svg className="calendar-icon" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {formatDate(eventDate)}
                  <input
                    type="date"
                    className="date-input-hidden"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start time</label>
                  <select className="form-select" value={startTime} onChange={(e) => setStartTime(e.target.value)}>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
                    })}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">End time</label>
                  <select className="form-select" value={endTime} onChange={(e) => setEndTime(e.target.value)}>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, '0');
                      return <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>;
                    })}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Venue</label>
                  <select className="form-select" value={venue} onChange={(e) => setVenue(e.target.value)}>
                    <option>Sturehof</option>
                    <option>Berns</option>
                    <option>Debaser</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Dancefloor</label>
                  <select className="form-select" value={danceFloor} onChange={(e) => setDanceFloor(e.target.value)}>
                    <option>Main Dining</option>
                    <option>Upstairs</option>
                    <option>Basement</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Amount in SEK</label>
                <input
                  type="number"
                  className="form-input"
                  placeholder="5000"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2: Invite Artists */}
          {currentStep === 2 && (
            <div className="step-content">
              <div className="invite-method-tabs">
                <button
                  className={`invite-tab ${inviteMethod === 'interest' ? 'active' : ''}`}
                  onClick={() => setInviteMethod('interest')}
                >
                  Interest check
                </button>
                <button
                  className={`invite-tab ${inviteMethod === 'booking' ? 'active' : ''}`}
                  onClick={() => setInviteMethod('booking')}
                >
                  Booking request
                </button>
              </div>

              <div className="search-box">
                <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search artists by name, phone or email"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="invite-info">
                <p>Don't see the artist? Invite them via email or phone.</p>
                <button className="btn-invite-new">+ Invite new artist</button>
              </div>

              <div className="artists-list">
                {filteredArtists.map(artist => (
                  <label key={artist.id} className="artist-item">
                    <input
                      type="checkbox"
                      checked={selectedArtists.includes(artist.id)}
                      onChange={() => toggleArtist(artist.id)}
                    />
                    <div className="artist-avatar-small">
                      {artist.name.charAt(0)}
                    </div>
                    <div className="artist-info-small">
                      <div className="artist-name-small">{artist.name}</div>
                      <div className="artist-genres-small">{artist.genres.join(', ')}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Attach PDF */}
          {currentStep === 3 && (
            <div className="step-content step-upload">
              <div className="upload-area" onClick={() => document.getElementById('file-upload')?.click()}>
                <div className="upload-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4l-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z"/>
                  </svg>
                </div>
                <p className="upload-text">Click to upload documents</p>
                <p className="upload-hint">PDF, DOCX up to 10MB</p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.docx"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </div>

              {uploadedFile && (
                <div className="uploaded-file">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/>
                  </svg>
                  <span>{uploadedFile.name}</span>
                  <button onClick={() => setUploadedFile(null)}>×</button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="wizard-footer">
          {currentStep > 1 && (
            <button className="btn-back" onClick={handleBack}>
              Back
            </button>
          )}
          
          <div className="footer-spacer"></div>

          {currentStep < 3 ? (
            <button className="btn-next" onClick={handleNext}>
              Next step
            </button>
          ) : (
            <button className="btn-create" onClick={handleCreate}>
              ✓ Create Gig
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateEventWizard;
