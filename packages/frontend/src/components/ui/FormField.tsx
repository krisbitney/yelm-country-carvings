import React, { ReactElement, cloneElement } from 'react';

type ValidationState = 'default' | 'error' | 'success' | 'warning' | 'loading';

interface FormFieldProps {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  validationState?: ValidationState;
  showSuccessIcon?: boolean;
  isLoading?: boolean;
  disabled?: boolean;
  children: ReactElement;
}

/**
 * A base form field component that handles common form field functionality
 * like labels, validation states, and error messages
 */
const FormField: React.FC<FormFieldProps> = ({
  label,
  id,
  error,
  required = false,
  className = '',
  helpText,
  validationState = error ? 'error' : 'default',
  showSuccessIcon = false,
  isLoading = false,
  disabled,
  children,
}) => {
  // Determine validation state from error prop if not explicitly provided
  const effectiveValidationState = isLoading ? 'loading' : validationState;

  // Determine if we need to show a message and what type
  const showErrorMessage = error && effectiveValidationState === 'error';
  const showHelpText = helpText && !showErrorMessage;

  // Determine the describedby ID for accessibility
  const describedById = showErrorMessage ? `${id}-error` : showHelpText ? `${id}-help` : undefined;

  return (
    <div className={`${className} relative`}>
      <label htmlFor={id} className="block font-body text-neutral-dark mb-1 text-sm font-medium">
        {label} {required && <span className="text-red-600">*</span>}
      </label>

      {/* Pass important props to children */}
      {cloneElement(children, {
        id,
        'aria-invalid': effectiveValidationState === 'error' ? 'true' : 'false',
        'aria-describedby': describedById,
        required,
        disabled: disabled || isLoading,
      } as React.JSX.IntrinsicAttributes)}

      {/* Validation icons */}
      {effectiveValidationState === 'success' && showSuccessIcon && (
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}

      {effectiveValidationState === 'error' && (
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none animate-pulse"
          aria-hidden="true"
        >
          <svg
            className="h-5 w-5 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}

      {effectiveValidationState === 'warning' && (
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            className="h-5 w-5 text-yellow-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
      )}

      {isLoading && (
        <div 
          className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none"
          aria-hidden="true"
        >
          <span className="sr-only">Loading</span>
          <svg
            className="animate-spin h-5 w-5 text-blue-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      )}

      {/* Error message with animation */}
      {showErrorMessage && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600 animate-fadeIn flex items-center"
          role="alert"
        >
          <svg
            className="h-4 w-4 mr-1 inline"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 10V3L4 14h7v7l9-11h-7z"
            />
          </svg>
          {error}
        </p>
      )}

      {/* Help text */}
      {showHelpText && (
        <p id={`${id}-help`} className="mt-1 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
};

export default FormField;
