import React, { useEffect, useState, useMemo } from 'react';
import { toast } from 'react-toastify';
import AdminLayout from '../components/AdminLayout';
import EventForm from '../components/EventForm';
import { useAdminEvents } from '../hooks/useAdminEvents';
import { MarketEvent } from '../../types.ts';
import {formatDateRange} from "../../utils/dateUtils.ts";

const EventsPage: React.FC = () => {
  const { events, loading, error, fetchEvents, createEvent, updateEvent, deleteEvent, uploadEventImage } = useAdminEvents();
  const [selectedEvent, setSelectedEvent] = useState<MarketEvent | null>(null);
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [isEditingEvent, setIsEditingEvent] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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
      pastEvents: past,
      upcomingEvents: upcoming,
      futureEvents: future
    };
  }, [events]);

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
            <div className="space-y-8">
              {/* Upcoming Events Section (three nearest future events) */}
              <div>
                <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-4">Upcoming Events</h3>
                {upcomingEvents.length === 0 ? (
                  <div className="text-center py-4 bg-[#F5F1E9] rounded-lg">
                    <p className="text-[#3E3C3B] font-['Lato']">No upcoming events scheduled.</p>
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
                        {upcomingEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-[#F5F1E9]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 mr-4">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={event.image.startsWith('/') ? event.image : `/${event.image}`}
                                    alt={event.title}
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-[#3E3C3B]">{event.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#3E3C3B]">{formatDateRange(event.startDate, event.endDate)}</div>
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
              </div>

              {/* Future Events Section (beyond the nearest three) */}
              <div>
                <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-4">Future Events</h3>
                {futureEvents.length === 0 ? (
                  <div className="text-center py-4 bg-[#F5F1E9] rounded-lg">
                    <p className="text-[#3E3C3B] font-['Lato']">No additional future events scheduled.</p>
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
                        {futureEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-[#F5F1E9]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 mr-4">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={event.image.startsWith('/') ? event.image : `/${event.image}`}
                                    alt={event.title}
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-[#3E3C3B]">{event.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#3E3C3B]">{formatDateRange(event.startDate, event.endDate)}</div>
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
              </div>

              {/* Past Events Section */}
              <div>
                <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41] mb-4">Past Events</h3>
                {pastEvents.length === 0 ? (
                  <div className="text-center py-4 bg-[#F5F1E9] rounded-lg">
                    <p className="text-[#3E3C3B] font-['Lato']">No past events found.</p>
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
                        {pastEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-[#F5F1E9]">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 mr-4">
                                  <img
                                    className="h-10 w-10 rounded-full object-cover"
                                    src={event.image.startsWith('/') ? event.image : `/${event.image}`}
                                    alt={event.title}
                                  />
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-[#3E3C3B]">{event.title}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-[#3E3C3B]">{formatDateRange(event.startDate, event.endDate)}</div>
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
              </div>
            </div>
          )}
        </>
      )}
    </AdminLayout>
  );
};

export default EventsPage;
