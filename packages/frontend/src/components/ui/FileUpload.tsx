import React, { InputHTMLAttributes, useState } from 'react';

interface FileUploadProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  className?: string;
  acceptedTypes?: string[];
  maxSizeMB?: number;
  onFileValidated?: (file: File | null) => void;
}

/**
 * A reusable file upload component with validation
 */
const FileUpload: React.FC<FileUploadProps> = ({
  label,
  id,
  error,
  required = false,
  className = '',
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp'],
  maxSizeMB = 5,
  onFileValidated,
  onChange,
  ...props
}) => {
  const [validationError, setValidationError] = useState<string | undefined>(error);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Call the original onChange if provided
    if (onChange) {
      onChange(e);
    }

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Validate file type
      if (!acceptedTypes.includes(file.type)) {
        const errorMsg = `Please upload only ${acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')} files.`;
        setValidationError(errorMsg);
        if (onFileValidated) onFileValidated(null);
        return;
      }

      // Validate file size
      const maxSize = maxSizeMB * 1024 * 1024; // Convert MB to bytes
      if (file.size > maxSize) {
        const errorMsg = `File size exceeds ${maxSizeMB}MB limit. Please upload a smaller file.`;
        setValidationError(errorMsg);
        if (onFileValidated) onFileValidated(null);
        return;
      }

      // File passed validation
      setValidationError(undefined);
      if (onFileValidated) onFileValidated(file);
    }
  };

  return (
    <div className={className}>
      <label htmlFor={id} className="block font-body text-neutral-dark mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        type="file"
        id={id}
        className={`w-full px-4 py-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-secondary ${
          validationError ? 'border-red-500' : ''
        }`}
        aria-invalid={validationError ? 'true' : 'false'}
        aria-describedby={validationError ? `${id}-error` : undefined}
        required={required}
        accept={acceptedTypes.join(',')}
        onChange={handleFileChange}
        {...props}
      />
      {validationError && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {validationError}
        </p>
      )}
      <p className="mt-1 text-xs text-neutral-dark">
        Accepted file types:{' '}
        {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}. Max size:{' '}
        {maxSizeMB}MB
      </p>
    </div>
  );
};

export default FileUpload;
