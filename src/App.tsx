import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import CalendarView from './components/CalendarView';
import WeekView from './components/WeekView';
import ArtistsView from './components/ArtistsView';
import RequestsView from './components/RequestsView';
import HistoryView from './components/HistoryView';
import MarketplaceView from './components/MarketplaceView';
import CreateEventWizard from './components/CreateEventWizard';
import EventDetailsModal from './components/EventDetailsModal';
import ArtistProfileModal from './components/ArtistProfileModal';
import BookArtistModal from './components/BookArtistModal';
import LoginPage from './components/LoginPage';
import { Event, Artist } from './types';
import { authService } from './services/auth.service';
import { eventService } from './services/event.service';
import './App.css';

// Mock artists with enhanced data
const mockArtists: Artist[] = [
  { 
    id: '1', 
    name: 'DJ Terka', 
    type: 'DJ', 
    location: 'Stockholm', 
    genres: ['House', 'Techno', 'Tech House'], 
    about: 'Professional DJ with 5+ years of experience. Specializing in underground house and techno. Known for creating unforgettable dance floor experiences.',
    priceRange: '5000-8000',
    rating: 4.9,
    reviewCount: 23,
    experience: '5 years'
  },
  { 
    id: '2', 
    name: 'AronChupa', 
    type: 'Producer & DJ', 
    location: 'Stockholm', 
    genres: ['House', 'EDM', 'Pop'], 
    about: 'Swedish producer and DJ known for energetic sets and crowd engagement. Perfect for high-energy events.',
    priceRange: '10000-15000',
    rating: 5.0,
    reviewCount: 45,
    experience: '10+ years'
  },
  { 
    id: '3', 
    name: 'Malcomba', 
    type: 'DJ', 
    location: 'Stockholm', 
    genres: ['Disco', 'Funk', 'Soul'], 
    about: 'Disco and funk specialist bringing the groove to every party. Vinyl collector and music enthusiast.',
    priceRange: '6000-9000',
    rating: 4.8,
    reviewCount: 18,
    experience: '7 years'
  },
];

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [activeTab, setActiveTab] = useState<string>('events');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBookArtistModal, setShowBookArtistModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 20));
  const [viewMode, setViewMode] = useState<'week' | 'month'>('month');
  const [loading, setLoading] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<{date: Date, time?: string} | null>(null);

  // Load events from API
  useEffect(() => {
    if (isAuthenticated) {
      loadEvents();
    }
  }, [isAuthenticated]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await eventService.getEvents();
      
      // Convert API events to frontend format
      const formattedEvents: Event[] = eventsData.map((e: any) => ({
        id: e.id.toString(),
        name: e.event_name,
        date: new Date(e.event_date),
        startTime: e.start_time,
        endTime: e.end_time,
        danceFloor: e.dance_floor_id?.toString() || '',
        amount: parseFloat(e.amount_sek) || 0,
        notes: e.notes || '',
        frequency: e.frequency || 'single',
        status: e.status || 'created',
        artistName: e.artist_name || undefined,
        artistId: e.artist_id?.toString() || undefined,
      }));
      
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to load events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (event: Event, selectedArtists?: string[], pdfFile?: File) => {
    try {
      await eventService.createEvent(event);
      setShowCreateModal(false);
      setSelectedDateTime(null);
      // TODO: Handle selected artists and PDF file
      // Reload events from API
      await loadEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleDateTimeClick = (date: Date, time?: string) => {
    setSelectedDateTime({ date, time });
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setSelectedDateTime(null);
  };

  const handleMessageArtist = (artistId: string, artistName: string) => {
    setSelectedEvent(null);
    setActiveTab('requests');
    // TODO: Scroll to specific event request
  };

  const handleBookArtist = (selectedArtists: string[], selectedEvents: string[], mode: 'interest' | 'booking') => {
    console.log('Booking:', { selectedArtists, selectedEvents, mode });
    setShowBookArtistModal(false);
    // TODO: Send booking requests
  };

  const handleOpenBookArtist = () => {
    setShowBookArtistModal(true);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setEvents([]);
  };

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="app">
      <Navigation 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onLogout={handleLogout}
      />
      
      {activeTab === 'events' && (
        <>
          {viewMode === 'month' ? (
            <CalendarView
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              events={events}
              onCreateEvent={handleDateTimeClick}
              onEventClick={setSelectedEvent}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onOpenBookArtist={() => setShowBookArtistModal(true)}
            />
          ) : (
            <WeekView
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              events={events}
              onCreateEvent={handleDateTimeClick}
              onEventClick={setSelectedEvent}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          )}
        </>
      )}

      {activeTab === 'artists' && <ArtistsView />}
      {activeTab === 'requests' && <RequestsView />}
      {activeTab === 'history' && <HistoryView />}
      {activeTab === 'marketplace' && <MarketplaceView />}

      {showCreateModal && (
        <CreateEventWizard
          onClose={handleCloseModal}
          onCreate={handleCreateEvent}
          initialDate={selectedDateTime?.date || currentDate}
          initialTime={selectedDateTime?.time}
          artists={mockArtists}
        />
      )}

      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onUpdate={loadEvents}
          onDelete={loadEvents}
          onMessageArtist={handleMessageArtist}
          artists={mockArtists}
        />
      )}

      {selectedArtist && (
        <ArtistProfileModal
          artist={selectedArtist}
          onClose={() => setSelectedArtist(null)}
          onBookNow={(artistId) => {
            // TODO: Open create event modal with artist pre-selected
            setSelectedArtist(null);
            setShowCreateModal(true);
          }}
          onMessage={(artistId) => {
            setSelectedArtist(null);
            setActiveTab('messages');
          }}
        />
      )}

      {showBookArtistModal && (
        <BookArtistModal
          onClose={() => setShowBookArtistModal(false)}
          onBook={handleBookArtist}
          artists={mockArtists}
          events={events}
        />
      )}
    </div>
  );
}

export default App;
