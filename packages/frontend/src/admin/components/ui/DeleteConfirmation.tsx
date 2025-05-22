import React from 'react';

interface DeleteConfirmationProps {
  onConfirm: () => void;
  onCancel: () => void;
  message?: string;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  onConfirm,
  onCancel,
  message = 'Confirm?',
}) => {
  return (
    <div className="flex justify-end items-center space-x-2">
      <span className="text-[#3E3C3B]">{message}</span>
      <button onClick={onConfirm} className="text-red-600 hover:text-red-800">
        Yes
      </button>
      <button onClick={onCancel} className="text-[#4A6151] hover:text-[#3D5142]">
        No
      </button>
    </div>
  );
};

export default DeleteConfirmation;
