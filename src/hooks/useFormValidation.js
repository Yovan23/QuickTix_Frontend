import { useState, useCallback } from 'react';
import { validateForm } from '@/utils/validators';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules { fieldName: [validators] }
 * @returns {Object} Form state and handlers
 */
export function useFormValidation(initialValues = {}, validationRules = {}) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    /**
     * Handle input change
     */
    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setValues((prev) => ({
            ...prev,
            [name]: newValue,
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }
    }, [errors]);

    /**
     * Handle input blur - validate single field
     */
    const handleBlur = useCallback((e) => {
        const { name } = e.target;

        setTouched((prev) => ({
            ...prev,
            [name]: true,
        }));

        // Validate this field
        if (validationRules[name]) {
            const fieldErrors = validateForm(
                { [name]: values[name] },
                { [name]: validationRules[name] }
            );

            setErrors((prev) => ({
                ...prev,
                [name]: fieldErrors[name] || null,
            }));
        }
    }, [values, validationRules]);

    /**
     * Set a specific field value programmatically
     */
    const setValue = useCallback((name, value) => {
        setValues((prev) => ({
            ...prev,
            [name]: value,
        }));
    }, []);

    /**
     * Set a specific field error
     */
    const setError = useCallback((name, error) => {
        setErrors((prev) => ({
            ...prev,
            [name]: error,
        }));
    }, []);

    /**
     * Validate all fields
     * @returns {boolean} True if form is valid
     */
    const validateAll = useCallback(() => {
        const allErrors = validateForm(values, validationRules);
        setErrors(allErrors);

        // Mark all fields as touched
        const allTouched = Object.keys(validationRules).reduce((acc, key) => {
            acc[key] = true;
            return acc;
        }, {});
        setTouched(allTouched);

        return Object.keys(allErrors).length === 0;
    }, [values, validationRules]);

    /**
     * Handle form submission
     * @param {Function} onSubmit - Submit handler
     * @returns {Function} Event handler
     */
    const handleSubmit = useCallback((onSubmit) => {
        return async (e) => {
            e.preventDefault();

            const isValid = validateAll();
            if (!isValid) return;

            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } finally {
                setIsSubmitting(false);
            }
        };
    }, [values, validateAll]);

    /**
     * Reset form to initial values
     */
    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
        setIsSubmitting(false);
    }, [initialValues]);

    /**
     * Get error for a field (only if touched)
     */
    const getError = useCallback((name) => {
        return touched[name] ? errors[name] : null;
    }, [touched, errors]);

    /**
     * Check if form has any errors
     */
    const hasErrors = Object.keys(errors).some((key) => errors[key]);

    /**
     * Check if form is valid (all validations pass)
     */
    const isValid = !hasErrors && Object.keys(validationRules).every(
        (key) => !validateForm({ [key]: values[key] }, { [key]: validationRules[key] })[key]
    );

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        setValue,
        setError,
        setValues,
        setErrors,
        validateAll,
        reset,
        getError,
        hasErrors,
        isValid,
    };
}

export default useFormValidation;
