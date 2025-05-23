import { useState, useCallback } from 'react';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Modal } from '../Modal';

const localizer = momentLocalizer(moment);

type Event = {
  id: string;
  title: string;
  description: string;
  start: Date;
  end: Date;
  type: 'training' | 'scrim' | 'official' | string;
};

const eventTypeColors = {
  training: '#3b82f6', // blue
  scrim: '#10b981', // green
  official: '#ef4444', // red
  default: '#8b5cf6', // purple
};

export const ScheduleTab = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: 'training',
  });
  const [view, setView] = useState<View>(Views.WEEK);

  const players = [
    { id: '1', name: 'Player 1' },
    { id: '2', name: 'Player 2' },
  ];

  const handleSelectSlot = useCallback(({ start, end }: { start: Date; end: Date }) => {
    setNewEvent({
      start,
      end,
      type: 'training',
    });
    setShowModal(true);
  }, [players]);

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.start && newEvent.end) {
      const event: Event = {
        id: Math.random().toString(36).substring(7),
        title: newEvent.title!,
        description: newEvent.description || '',
        start: newEvent.start!,
        end: newEvent.end!,
        type: newEvent.type || 'training',
      };
      setEvents([...events, event]);
      setShowModal(false);
    }
  };

  const eventStyleGetter = (event: Event) => {
    const backgroundColor = eventTypeColors[event.type as keyof typeof eventTypeColors] || eventTypeColors.default;
    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
      },
    };
  };

  return (
    <div className="h-[calc(100vh-200px)]">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => {
            setNewEvent({
              type: 'training',
            });
            setShowModal(true);
          }}
          className="px-4 py-2 bg-accent rounded hover:bg-accent-dark"
        >
          Add Event
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        selectable
        onSelectSlot={handleSelectSlot}
        defaultView={view}
        views={[Views.DAY, Views.WEEK]}
        eventPropGetter={eventStyleGetter}
        components={{
          event: ({ event }) => (
            <div className="p-1">
              <strong>{event.title}</strong>
            </div>
          ),
        }}
      />

      {showModal && <Modal overlayClickable onClose={() => setShowModal(false)} title="Add New Event">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Title</label>
            <input
              type="text"
              className="w-full bg-neutral-700 border border-neutral-600 rounded p-2"
              value={newEvent.title || ''}
              onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              className="w-full bg-neutral-700 border border-neutral-600 rounded p-2"
              value={newEvent.description || ''}
              onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Event Type</label>
            <select
              className="w-full bg-neutral-700 border border-neutral-600 rounded p-2"
              value={newEvent.type}
              onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
            >
              <option value="training">Training</option>
              <option value="scrim">Scrim</option>
              <option value="official">Official Match</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Time</label>
              <input
                type="datetime-local"
                className="w-full bg-neutral-700 border border-neutral-600 rounded p-2"
                value={newEvent.start ? moment(newEvent.start).format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setNewEvent({ ...newEvent, start: new Date(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">End Time</label>
              <input
                type="datetime-local"
                className="w-full bg-neutral-700 border border-neutral-600 rounded p-2"
                value={newEvent.end ? moment(newEvent.end).format('YYYY-MM-DDTHH:mm') : ''}
                onChange={(e) => setNewEvent({ ...newEvent, end: new Date(e.target.value) })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Availability</label>
          </div>

          <button
            onClick={handleAddEvent}
            className="w-full py-2 bg-accent rounded hover:bg-accent-dark"
          >
            Add Event
          </button>
        </div>
      </Modal>}
    </div>
  );
};