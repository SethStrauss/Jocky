import React, { useState } from 'react';
import { Event, Artist } from '../types';
import { eventService } from '../services/event.service';
import './EventDetailsModal.css';

interface EventDetailsModalProps {
  event: Event;
  onClose: () => void;
  onUpdate: () => void;
  onDelete?: () => void;
  onMessageArtist?: (artistId: string, artistName: string) => void;
  artists: Artist[];
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  event,
  onClose,
  onUpdate,
  onDelete,
  onMessageArtist,
  artists
}) => {
  const [selectedArtistId, setSelectedArtistId] = useState('');
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleSendOffer = async () => {
    if (!selectedArtistId) {
      alert('Please select an artist');
      return;
    }

    try {
      setSending(true);
      await eventService.sendOfferToArtist(event.id, selectedArtistId);
      alert('Offer sent successfully!');
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to send offer:', error);
      alert('Failed to send offer. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete "${event.name}"? This cannot be undone.`)) {
      return;
    }

    try {
      setDeleting(true);
      await eventService.deleteEvent(event.id);
      alert('Event deleted successfully');
      if (onDelete) onDelete();
      onClose();
    } catch (error) {
      console.error('Failed to delete event:', error);
      alert('Failed to delete event. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusDisplay = (status?: string) => {
    switch (status) {
      case 'open': return { label: 'Open', class: 'status-open' };
      case 'offered': return { label: 'Offered', class: 'status-offered' };
      case 'confirmed': return { label: 'Confirmed', class: 'status-confirmed' };
      case 'declined': return { label: 'Declined', class: 'status-declined' };
      case 'cancelled': return { label: 'Cancelled', class: 'status-declined' };
      default: return { label: 'Open', class: 'status-open' };
    }
  };

  const statusInfo = getStatusDisplay(event.status);
  const canSendOffer = event.status === 'open' || event.status === 'declined';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="event-details-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">{event.name}</h2>
            <span className={`status-badge ${statusInfo.class}`}>
              {statusInfo.label}
            </span>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="event-info">
          <div className="info-row">
            <span className="info-label">Date:</span>
            <span className="info-value">
              {event.date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>

          <div className="info-row">
            <span className="info-label">Time:</span>
            <span className="info-value">{event.startTime} - {event.endTime}</span>
          </div>

          {event.amount > 0 && (
            <div className="info-row">
              <span className="info-label">Amount:</span>
              <span className="info-value">{event.amount.toLocaleString()} SEK</span>
            </div>
          )}

          {event.notes && (
            <div className="info-row">
              <span className="info-label">Notes:</span>
              <span className="info-value">{event.notes}</span>
            </div>
          )}

          {event.artistName && (
            <div className="info-row">
              <span className="info-label">Artist:</span>
              <span className="info-value">{event.artistName}</span>
            </div>
          )}
        </div>

        {canSendOffer && (
          <div className="send-offer-section">
            <h3>Send Offer to Artist</h3>
            <select
              className="artist-select"
              value={selectedArtistId}
              onChange={(e) => setSelectedArtistId(e.target.value)}
            >
              <option value="">Select an artist...</option>
              {artists.map((artist) => (
                <option key={artist.id} value={artist.id}>
                  {artist.name} - {artist.genres?.join(', ')}
                </option>
              ))}
            </select>

            <button
              className="btn-send-offer"
              onClick={handleSendOffer}
              disabled={sending || !selectedArtistId}
            >
              {sending ? 'Sending...' : 'Send Offer'}
            </button>
          </div>
        )}

        {event.status === 'offered' && (
          <div className="status-message status-message-offered">
            Offer sent to artist. Waiting for response...
          </div>
        )}

        {event.status === 'confirmed' && (
          <div className="status-message status-message-confirmed">
            ✓ Event confirmed with {event.artistName}
          </div>
        )}

        <div className="modal-footer">
          {event.artistId && event.artistName && onMessageArtist && (
            <button
              className="btn-message-artist-event"
              onClick={() => onMessageArtist(event.artistId!, event.artistName!)}
            >
              💬 Message {event.artistName}
            </button>
          )}
          
          <button
            className="btn-delete-event"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete Event'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsModal;
