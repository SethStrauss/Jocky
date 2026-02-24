import React, { useState } from 'react';
import { Event } from '../types';
import './CalendarView.css';

interface CalendarViewProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  events: Event[];
  onCreateEvent: (date: Date, time?: string) => void;
  onEventClick?: (event: Event) => void;
  viewMode: 'week' | 'month';
  onViewModeChange: (mode: 'week' | 'month') => void;
  onOpenBookArtist?: () => void;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  currentDate,
  onDateChange,
  events,
  onCreateEvent,
  onEventClick,
  viewMode,
  onViewModeChange,
  onOpenBookArtist,
}) => {
  const [displayMode, setDisplayMode] = useState<'list' | 'calendar'>('calendar');

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    // Get day of week (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDay.getDay();
    // Convert to Monday = 0
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;
    
    const days: (number | null)[] = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    
    return days;
  };

  const days = getDaysInMonth();

  const goToPreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    onDateChange(newDate);
  };

  const goToNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    onDateChange(newDate);
  };

  const goToToday = () => {
    onDateChange(new Date(2026, 1, 20)); // February 20th, 2026
  };

  return (
    <div className="calendar-view">
      {/* Header */}
      <div className="calendar-header">
        <div className="calendar-header-left">
          <h1 className="calendar-title">Events</h1>
          
          <div className="view-mode-toggle">
            <button
              className={`toggle-btn ${viewMode === 'week' ? 'active' : ''}`}
              onClick={() => onViewModeChange('week')}
            >
              Week
            </button>
            <button
              className={`toggle-btn ${viewMode === 'month' ? 'active' : ''}`}
              onClick={() => onViewModeChange('month')}
            >
              Month
            </button>
          </div>
        </div>

        <div className="calendar-header-right">
          <button
            className={`display-mode-btn ${displayMode === 'list' ? 'active' : ''}`}
            onClick={() => setDisplayMode('list')}
            title="List view"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>

          <button
            className={`display-mode-btn ${displayMode === 'calendar' ? 'active' : ''}`}
            onClick={() => setDisplayMode('calendar')}
            title="Calendar view"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
          </button>

          <button className="btn-book-artist" onClick={onOpenBookArtist}>
            Book artist
          </button>

          <button className="btn-create-event" onClick={() => onCreateEvent(currentDate)}>
            <span className="plus-icon">+</span>
            Create Event
          </button>
        </div>
      </div>

      {/* Month Navigation */}
      <div className="month-navigation">
        <h2 className="month-title">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>

        <div className="month-controls">
          <button className="nav-arrow" onClick={goToPreviousMonth}>
            ‹
          </button>
          <button className="btn-today" onClick={goToToday}>
            Today
          </button>
          <button className="nav-arrow" onClick={goToNextMonth}>
            ›
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="calendar-grid-container">
        <div className="calendar-grid">
          {/* Week day headers */}
          {weekDays.map((day) => (
            <div key={day} className="calendar-day-header">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {days.map((day, index) => {
            const cellDate = day !== null ? new Date(currentDate.getFullYear(), currentDate.getMonth(), day) : null;
            const dayEvents = cellDate ? events.filter(e => {
              const eventDate = new Date(e.date);
              return eventDate.getDate() === cellDate.getDate() &&
                     eventDate.getMonth() === cellDate.getMonth() &&
                     eventDate.getFullYear() === cellDate.getFullYear();
            }) : [];

            return (
              <div
                key={index}
                className={`calendar-day-cell ${day === null ? 'empty' : ''} ${
                  day === 20 ? 'today' : ''
                }`}
                onClick={() => {
                  if (day !== null) {
                    // Create date at noon to avoid timezone issues
                    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day, 12, 0, 0);
                    onCreateEvent(clickedDate);
                  }
                }}
              >
                {day !== null && (
                  <>
                    <div className="day-number">{day}</div>
                    <div className="day-events">
                      {dayEvents.map(event => (
                        <div 
                          key={event.id} 
                          className={`event-badge event-status-${event.status || 'created'}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEventClick) onEventClick(event);
                          }}
                        >
                          <span className="event-time">{event.startTime}</span>
                          <span className="event-name">{event.name}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Legend */}
      <div className="status-legend">
        <div className="legend-item legend-open">Open</div>
        <div className="legend-item legend-offered">Offered</div>
        <div className="legend-item legend-confirmed">Confirmed</div>
        <div className="legend-item legend-declined">Declined</div>
      </div>
    </div>
  );
};

export default CalendarView;
