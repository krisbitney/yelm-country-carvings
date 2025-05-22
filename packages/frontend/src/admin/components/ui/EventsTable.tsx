import React from 'react';
import { MarketEvent } from '../../../types';
import BulkDeleteConfirmation from './BulkDeleteConfirmation';
import EventTableRow from './EventTableRow';

interface EventsTableProps {
  title: string;
  events: MarketEvent[];
  selectedEventIds: number[];
  confirmDelete: number | null;
  confirmBulkDelete: boolean;
  onToggleSelection: (id: number) => void;
  onEdit: (event: MarketEvent) => void;
  onDelete: (id: number) => void;
  onConfirmDelete: (id: number) => void;
  onCancelDelete: () => void;
  onConfirmBulkDelete: () => void;
  onCancelBulkDelete: () => void;
  onSetBulkDelete: (value: boolean) => void;
}

const EventsTable: React.FC<EventsTableProps> = ({
  title,
  events,
  selectedEventIds,
  confirmDelete,
  confirmBulkDelete,
  onToggleSelection,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
  onConfirmBulkDelete,
  onCancelBulkDelete,
  onSetBulkDelete,
}) => {
  // Count of selected events in this category
  const selectedCount = selectedEventIds.filter(id => events.some(e => e.id === id)).length;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-['Cinzel'] text-2xl font-bold text-[#6B4F41]">{title}</h3>
        {events.length > 0 && selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            {confirmBulkDelete ? (
              <BulkDeleteConfirmation
                count={selectedCount}
                onConfirm={onConfirmBulkDelete}
                onCancel={onCancelBulkDelete}
              />
            ) : (
              <button
                onClick={() => onSetBulkDelete(true)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
              >
                Delete Selected
              </button>
            )}
          </div>
        )}
      </div>
      {events.length === 0 ? (
        <div className="text-center py-4 bg-[#F5F1E9] rounded-lg">
          <p className="text-[#3E3C3B] font-['Lato']">No {title.toLowerCase()} found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-[#A07E5D]/20">
            <thead className="bg-[#4A6151]">
              <tr>
                <th
                  scope="col"
                  className="px-2 py-3 text-center text-xs font-medium text-white uppercase tracking-wider w-10"
                ></th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Date
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider"
                >
                  Location
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-white uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-[#A07E5D]/20">
              {events.map(event => (
                <EventTableRow
                  key={event.id}
                  event={event}
                  selectedEventIds={selectedEventIds}
                  confirmDelete={confirmDelete}
                  onToggleSelection={onToggleSelection}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onConfirmDelete={onConfirmDelete}
                  onCancelDelete={onCancelDelete}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default EventsTable;
