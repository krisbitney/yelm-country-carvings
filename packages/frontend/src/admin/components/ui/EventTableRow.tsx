import React from 'react';
import { MarketEvent } from '../../../types';
import { formatDate, formatDateRange } from '../../../utils/dateUtils';
import DeleteConfirmation from './DeleteConfirmation';

interface EventTableRowProps {
  event: MarketEvent;
  selectedEventIds: number[];
  confirmDelete: number | null;
  onToggleSelection: (id: number) => void;
  onEdit: (event: MarketEvent) => void;
  onDelete: (id: number) => void;
  onConfirmDelete: (id: number) => void;
  onCancelDelete: () => void;
}

const EventTableRow: React.FC<EventTableRowProps> = ({
  event,
  selectedEventIds,
  confirmDelete,
  onToggleSelection,
  onEdit,
  onDelete,
  onConfirmDelete,
  onCancelDelete,
}) => {
  return (
    <tr className="hover:bg-[#F5F1E9]">
      <td className="px-2 py-4 whitespace-nowrap text-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-[#4A6151] focus:ring-[#4A6151]"
          checked={selectedEventIds.includes(event.id)}
          onChange={() => onToggleSelection(event.id)}
        />
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 flex-shrink-0 mr-4">
            <img
              className="h-10 w-10 rounded-full object-cover"
              src={event.image.startsWith('/') ? event.image : `/${event.image}`}
              alt={event.title}
              loading={'lazy'}
            />
          </div>
          <div>
            <div className="text-sm font-medium text-[#3E3C3B]">{event.title}</div>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-[#3E3C3B]">
          {formatDateRange(event.startDate, event.endDate)}
        </div>
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
          <DeleteConfirmation
            onConfirm={() => onDelete(event.id)}
            onCancel={onCancelDelete}
          />
        ) : (
          <div className="flex justify-end items-center space-x-4">
            <button
              onClick={() => onEdit(event)}
              className="text-[#4A6151] hover:text-[#3D5142]"
            >
              Edit
            </button>
            <button
              onClick={() => onConfirmDelete(event.id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        )}
      </td>
    </tr>
  );
};

export default EventTableRow;
