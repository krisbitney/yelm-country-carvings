import React, { InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  className?: string;
}

/**
 * A reusable form input component with a label and validation
 */
const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  error,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block font-body text-neutral-dark mb-1">
        {label} {required && <span className="text-red-600">*</span>}
      </label>
      <input
        id={id}
        className={`w-full px-4 py-2 border border-primary-light rounded-md focus:outline-none focus:ring-2 focus:ring-secondary ${
          error ? 'border-red-500' : ''
        }`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${id}-error` : undefined}
        required={required}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput;
