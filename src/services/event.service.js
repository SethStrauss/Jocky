import { apiClient } from '../utils/api';

export const eventService = {
  // Get all events
  getEvents: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/events?${queryString}` : '/events';
    const response = await apiClient(endpoint);
    return response.events || [];
  },

  // Get single event
  getEventById: async (id) => {
    const response = await apiClient(`/events/${id}`);
    return response.event;
  },

  // Create event
  createEvent: async (eventData) => {
    const response = await apiClient('/events', {
      method: 'POST',
      body: JSON.stringify({
        event_name: eventData.name,
        event_date: eventData.date.toISOString().split('T')[0],
        start_time: eventData.startTime,
        end_time: eventData.endTime,
        dance_floor_id: eventData.danceFloor ? parseInt(eventData.danceFloor) : null,
        amount_sek: eventData.amount,
        notes: eventData.notes,
        frequency: eventData.frequency,
        status: 'created', // Always created status initially
      }),
    });
    return response.event;
  },

  // Update event
  updateEvent: async (id, eventData) => {
    const response = await apiClient(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
    return response.event;
  },

  // Delete event
  deleteEvent: async (id) => {
    await apiClient(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Send offer to artist
  sendOfferToArtist: async (eventId, artistId) => {
    const response = await apiClient(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify({
        status: 'offered',
      }),
    });
    
    // Also create booking record
    await apiClient('/bookings', {
      method: 'POST',
      body: JSON.stringify({
        event_id: eventId,
        artist_id: artistId,
      }),
    });
    
    return response.event;
  },
};
