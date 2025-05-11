import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import EventForm from '../components/EventForm';
import { useAdminEvents } from '../hooks/useAdminEvents';
import { MarketEvent } from '../types';

const EventsPage: React.FC = () => {
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent, uploadEventImage } = useAdminEvents();
  const [selectedEvent, setSelectedEvent] = useState<MarketEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Fetch events on component mount
  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

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

  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <AdminLayout title="Events Management">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="font-['Cinzel'] text-3xl font-bold text-[#6B4F41]">Events Management</h2>
        <button
          onClick={() => setIsAddingEvent(true)}
          className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-colors duration-300"
          disabled={isAddingEvent || isEditingEvent}
        >
          Add New Event
        </button>
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
              <p className="text-[#3E3C3B] font-['Lato'] mb-4">No events found. Add your first event to get started.</p>
              <button
                onClick={() => setIsAddingEvent(true)}
                className="px-4 py-2 bg-[#4A6151] text-white font-['Lato'] rounded-md hover:bg-[#3D5142] transition-colors duration-300"
              >
                Add New Event
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-[#A07E5D]/20">
                <thead className="bg-[#4A6151]">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Event
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[#A07E5D]/20">
                  {events.map((event) => (
                    <tr key={event.id} className="hover:bg-[#F5F1E9]">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 mr-4">
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={event.image}
                              alt={event.title}
                            />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-[#3E3C3B]">{event.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#3E3C3B]">{event.date}</div>
                        <div className="text-xs text-[#6B4F41]">
                          {event.startDate && `From: ${formatDate(event.startDate)}`}
                        </div>
                        <div className="text-xs text-[#6B4F41]">
                          {event.endDate && `To: ${formatDate(event.endDate)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-[#3E3C3B]">{event.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {confirmDelete === event.id ? (
                          <div className="flex justify-end items-center space-x-2">
                            <span className="text-[#3E3C3B]">Confirm?</span>
                            <button
                              onClick={() => handleDeleteEvent(event.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDelete(null)}
                              className="text-[#4A6151] hover:text-[#3D5142]"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <div className="flex justify-end items-center space-x-4">
                            <button
                              onClick={() => startEditEvent(event)}
                              className="text-[#4A6151] hover:text-[#3D5142]"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => setConfirmDelete(event.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default EventsPage;