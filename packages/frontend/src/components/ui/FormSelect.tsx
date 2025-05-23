import React, { SelectHTMLAttributes } from 'react';
import FormField from './FormField';

type ValidationState = 'default' | 'error' | 'success' | 'warning' | 'loading';

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  id: string;
  error?: string;
  required?: boolean;
  className?: string;
  helpText?: string;
  validationState?: ValidationState;
  showSuccessIcon?: boolean;
  isLoading?: boolean;
  options: Array<{ value: string; label: string }>;
}

/**
 * A reusable form select component with a label, validation states, and accessibility features
 * Uses the FormField component for common form field functionality
 */
const FormSelect: React.FC<FormSelectProps> = ({
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
  options,
  ...props
}) => {
  // Define validation styles based on state
  const getValidationStyles = () => {
    const state = isLoading ? 'loading' : validationState;
    switch (state) {
      case 'error':
        return 'border-red-500 focus:ring-red-500 focus:border-red-500';
      case 'success':
        return 'border-green-500 focus:ring-green-500 focus:border-green-500';
      case 'warning':
        return 'border-yellow-500 focus:ring-yellow-500 focus:border-yellow-500';
      case 'loading':
        return 'border-blue-300 focus:ring-blue-300 focus:border-blue-300';
      default:
        return 'border-primary-light focus:ring-[#B87351] focus:border-[#B87351]';
    }
  };

  return (
    <FormField
      label={label}
      id={id}
      error={error}
      required={required}
      className={className}
      helpText={helpText}
      validationState={validationState}
      showSuccessIcon={showSuccessIcon}
      isLoading={isLoading}
      disabled={disabled}
    >
      <select
        className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 transition-all duration-200 
          ${getValidationStyles()}
          ${disabled ? 'bg-gray-100 text-gray-500 cursor-not-allowed' : ''}
          ${isLoading ? 'pr-10' : ''}
          ${(validationState === 'success' && showSuccessIcon) || validationState === 'error' || validationState === 'warning' ? 'pr-10' : ''}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
};

export default FormSelect;