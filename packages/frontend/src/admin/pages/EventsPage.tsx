import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import EventForm from '../components/EventForm';
import { useAdminEvents } from '../hooks/useAdminEvents';
import { MarketEvent } from '../../types.ts';
import EventsTable from '../components/ui/EventsTable';

const EventsPage: React.FC = () => {
  const {
    events,
    loading,
    error,
    fetchEvents,
    fetchAvailableYears,
    createEvent,
    updateEvent,
    deleteEvent,
    uploadEventImage,
  } = useAdminEvents();
  const [selectedEvent, setSelectedEvent] = useState<MarketEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false);
  // Set initial year to current year
  const currentYear = useMemo(() => new Date().getFullYear(), []);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(currentYear);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Categorize events into past, upcoming, and future
  const { pastEvents, upcomingEvents, futureEvents } = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // Start of today

    // Sort events by date (ascending)
    const sortedEvents = [...events].sort((a, b) => {
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateA.getTime() - dateB.getTime();
    });

    // Categorize events
    const past: MarketEvent[] = [];
    const upcoming: MarketEvent[] = [];
    const future: MarketEvent[] = [];

    sortedEvents.forEach(event => {
      const eventDate = new Date(event.startDate);

      if (eventDate < today) {
        // Past events
        past.push(event);
      } else {
        // Future events (will be split into upcoming and future)
        if (upcoming.length < 3) {
          // Three nearest future events
          upcoming.push(event);
        } else {
          // Beyond the nearest three
          future.push(event);
        }
      }
    });

    return {
      pastEvents: past.reverse(),
      upcomingEvents: upcoming,
      futureEvents: future,
    };
  }, [events]);

  // Fetch available years when component mounts
  useEffect(() => {
    const getAvailableYears = async () => {
      const years = await fetchAvailableYears();
      // If no years are available, add the current year
      if (years.length === 0) {
        setAvailableYears([currentYear]);
      } else {
        setAvailableYears(years);
        // If current year is not in the list, select the most recent year
        if (!years.includes(currentYear) && selectedYear === currentYear) {
          setSelectedYear(years[0]);
        }
      }
    };
    void getAvailableYears();
  }, [fetchAvailableYears, currentYear, selectedYear]);

  // Fetch events when component mounts or selected year changes
  useEffect(() => {
    void fetchEvents(selectedYear);
  }, [fetchEvents, selectedYear]);

  // Handle error from useAdminEvents
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle event creation
  const handleCreateEvent = async (eventData: Omit<MarketEvent, 'id'>) => {
    const success = await createEvent(eventData);
    if (success) {
      setIsAddingEvent(false);
      void fetchEvents();
    }
  };

  // Handle event update
  const handleUpdateEvent = async (eventData: Omit<MarketEvent, 'id'>) => {
    if (!selectedEvent) return;

    const success = await updateEvent(selectedEvent.id, eventData);
    if (success) {
      setIsEditingEvent(false);
      setSelectedEvent(null);
      void fetchEvents();
    }
  };

  // Handle event deletion
  const handleDeleteEvent = async (id: number) => {
    const success = await deleteEvent(id);
    if (success) {
      setConfirmDelete(null);
      void fetchEvents();
    }
  };

  // Start editing an event
  const startEditEvent = (event: MarketEvent) => {
    setSelectedEvent(event);
    setIsEditingEvent(true);
  };

  // Cancel form
  const handleCancelForm = () => {
    setIsAddingEvent(false);
    setIsEditingEvent(false);
    setSelectedEvent(null);
  };

  // Handle bulk selection
  const toggleEventSelection = (id: number) => {
    setSelectedEventIds(prev =>
      prev.includes(id) ? prev.filter(eventId => eventId !== id) : [...prev, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    let successCount = 0;
    let failCount = 0;

    for (const id of selectedEventIds) {
      const success = await deleteEvent(id);
      if (success) {
        successCount++;
      } else {
        failCount++;
      }
    }

    if (successCount > 0) {
      toast.success(`Successfully deleted ${successCount} event${successCount !== 1 ? 's' : ''}`);
    }

    if (failCount > 0) {
      toast.error(`Failed to delete ${failCount} event${failCount !== 1 ? 's' : ''}`);
    }

    setSelectedEventIds([]);
    setConfirmBulkDelete(false);
    void fetchEvents();
  };

  return (
    <AdminLayout title="Events Management">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="font-['Cinzel'] text-3xl font-bold text-[#6B4F41]">Events Management</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="year-select" className="mr-2 text-[#3E3C3B] font-['Lato']">
              Filter by Year:
            </label>
            <select
              id="year-select"
              value={selectedYear || ''}
              onChange={e => setSelectedYear(e.target.value ? parseInt(e.target.value) : undefined)}
              className="border border-[#A07E5D] rounded-md px-3 py-1 bg-white text-[#3E3C3B] font-['Lato']"
            >
              <option value="">All Years</option>
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={() => setIsAddingEvent(true)}
            className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-colors duration-300"
            disabled={isAddingEvent || isEditingEvent}
          >
            Add New Event
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && !isAddingEvent && !isEditingEvent && (
        <div className="text-center py-8">
          <div className="w-12 h-12 border-4 border-[#4A6151] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-[#3E3C3B] font-['Lato']">Loading events...</p>
        </div>
      )}

      {/* Add/Edit Event Form */}
      {(isAddingEvent || isEditingEvent) && (
        <div className="mb-8">
          <EventForm
            event={isEditingEvent ? selectedEvent || undefined : undefined}
            onSubmit={isEditingEvent ? handleUpdateEvent : handleCreateEvent}
            onCancel={handleCancelForm}
            uploadImage={uploadEventImage}
          />
        </div>
      )}

      {/* Events List */}
      {!loading && !isAddingEvent && !isEditingEvent && (
        <>
          {events.length === 0 ? (
            <div className="text-center py-8 bg-[#F5F1E9] rounded-lg">
              <p className="text-[#3E3C3B] font-['Lato'] mb-4">
                No events found. Add your first event to get started.
              </p>
              <button
                onClick={() => setIsAddingEvent(true)}
                className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-colors duration-300"
              >
                Add New Event
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Upcoming Events Section (three nearest future events) */}
              <EventsTable
                title="Upcoming Events"
                events={upcomingEvents}
                selectedEventIds={selectedEventIds}
                confirmDelete={confirmDelete}
                confirmBulkDelete={confirmBulkDelete}
                onToggleSelection={toggleEventSelection}
                onEdit={startEditEvent}
                onDelete={handleDeleteEvent}
                onConfirmDelete={setConfirmDelete}
                onCancelDelete={() => setConfirmDelete(null)}
                onConfirmBulkDelete={handleBulkDelete}
                onCancelBulkDelete={() => setConfirmBulkDelete(false)}
                onSetBulkDelete={setConfirmBulkDelete}
              />

              {/* Future Events Section (beyond the nearest three) */}
              <EventsTable
                title="Future Events"
                events={futureEvents}
                selectedEventIds={selectedEventIds}
                confirmDelete={confirmDelete}
                confirmBulkDelete={confirmBulkDelete}
                onToggleSelection={toggleEventSelection}
                onEdit={startEditEvent}
                onDelete={handleDeleteEvent}
                onConfirmDelete={setConfirmDelete}
                onCancelDelete={() => setConfirmDelete(null)}
                onConfirmBulkDelete={handleBulkDelete}
                onCancelBulkDelete={() => setConfirmBulkDelete(false)}
                onSetBulkDelete={setConfirmBulkDelete}
              />

              {/* Past Events Section */}
              <EventsTable
                title="Past Events"
                events={pastEvents}
                selectedEventIds={selectedEventIds}
                confirmDelete={confirmDelete}
                confirmBulkDelete={confirmBulkDelete}
                onToggleSelection={toggleEventSelection}
                onEdit={startEditEvent}
                onDelete={handleDeleteEvent}
                onConfirmDelete={setConfirmDelete}
                onCancelDelete={() => setConfirmDelete(null)}
                onConfirmBulkDelete={handleBulkDelete}
                onCancelBulkDelete={() => setConfirmBulkDelete(false)}
                onSetBulkDelete={setConfirmBulkDelete}
              />
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default EventsPage;
