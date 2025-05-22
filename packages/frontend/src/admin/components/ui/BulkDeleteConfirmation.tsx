import React from 'react';

interface BulkDeleteConfirmationProps {
  count: number;
  onConfirm: () => void;
  onCancel: () => void;
}

const BulkDeleteConfirmation: React.FC<BulkDeleteConfirmationProps> = ({
  count,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="flex items-center space-x-2">
      <span className="text-sm text-[#3E3C3B]">
        Delete {count} {count === 1 ? 'event' : 'events'}?
      </span>
      <button
        onClick={onConfirm}
        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
      >
        Confirm
      </button>
      <button
        onClick={onCancel}
        className="px-3 py-1 bg-[#4A6151] text-white text-sm rounded hover:bg-[#3D5142]"
      >
        Cancel
      </button>
    </div>
  );
};

export default BulkDeleteConfirmation;