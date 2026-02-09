/**
 * Validation utility functions
 * Reusable validators for form inputs
 */

/**
 * Check if value is empty
 * @param {*} value - Value to check
 * @returns {boolean} True if empty
 */
export const isEmpty = (value) => {
    if (value === null || value === undefined) return true;
    if (typeof value === 'string') return value.trim().length === 0;
    if (Array.isArray(value)) return value.length === 0;
    if (typeof value === 'object') return Object.keys(value).length === 0;
    return false;
};

/**
 * Required field validator
 * @param {*} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const required = (value, fieldName = 'This field') => {
    if (isEmpty(value)) {
        return `${fieldName} is required`;
    }
    return null;
};

/**
 * Email format validator
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
    if (isEmpty(email)) return null; // Use required() for empty check

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    return null;
};

/**
 * Password strength validator
 * @param {string} password - Password to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 6)
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password, options = {}) => {
    const minLength = options.minLength || 6;

    if (isEmpty(password)) return null;

    if (password.length < minLength) {
        return `Password must be at least ${minLength} characters`;
    }
    return null;
};

/**
 * Password confirmation validator
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {string|null} Error message or null if valid
 */
export const validatePasswordMatch = (password, confirmPassword) => {
    if (isEmpty(confirmPassword)) return null;

    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return null;
};

/**
 * Phone number validator (Indian format)
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePhone = (phone) => {
    if (isEmpty(phone)) return null;

    // Remove spaces and dashes
    const cleanPhone = phone.replace(/[\s-]/g, '');

    // Indian phone number: 10 digits, optionally starting with +91
    const phoneRegex = /^(\+91)?[6-9]\d{9}$/;
    if (!phoneRegex.test(cleanPhone)) {
        return 'Please enter a valid 10-digit phone number';
    }
    return null;
};

/**
 * Name validator
 * @param {string} name - Name to validate
 * @param {Object} options - Validation options
 * @param {number} options.minLength - Minimum length (default: 2)
 * @param {number} options.maxLength - Maximum length (default: 50)
 * @returns {string|null} Error message or null if valid
 */
export const validateName = (name, options = {}) => {
    const minLength = options.minLength || 2;
    const maxLength = options.maxLength || 50;

    if (isEmpty(name)) return null;

    if (name.length < minLength) {
        return `Name must be at least ${minLength} characters`;
    }
    if (name.length > maxLength) {
        return `Name must not exceed ${maxLength} characters`;
    }

    // Only letters, spaces, and common name characters
    const nameRegex = /^[a-zA-Z\s'-]+$/;
    if (!nameRegex.test(name)) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }
    return null;
};

/**
 * Min length validator
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const minLength = (value, min, fieldName = 'This field') => {
    if (isEmpty(value)) return null;

    if (value.length < min) {
        return `${fieldName} must be at least ${min} characters`;
    }
    return null;
};

/**
 * Max length validator
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const maxLength = (value, max, fieldName = 'This field') => {
    if (isEmpty(value)) return null;

    if (value.length > max) {
        return `${fieldName} must not exceed ${max} characters`;
    }
    return null;
};

/**
 * Numeric validator
 * @param {*} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const isNumeric = (value, fieldName = 'This field') => {
    if (isEmpty(value)) return null;

    if (isNaN(Number(value))) {
        return `${fieldName} must be a number`;
    }
    return null;
};

/**
 * Positive number validator
 * @param {*} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const isPositive = (value, fieldName = 'This field') => {
    if (isEmpty(value)) return null;

    const num = Number(value);
    if (isNaN(num) || num <= 0) {
        return `${fieldName} must be a positive number`;
    }
    return null;
};

/**
 * Run multiple validators on a value
 * @param {*} value - Value to validate
 * @param {Array<Function>} validators - Array of validator functions
 * @returns {string|null} First error message or null if all pass
 */
export const validate = (value, validators) => {
    for (const validator of validators) {
        const error = validator(value);
        if (error) return error;
    }
    return null;
};

/**
 * Validate an entire form object
 * @param {Object} formData - Form data object
 * @param {Object} validationRules - Validation rules { fieldName: [validators] }
 * @returns {Object} Errors object { fieldName: errorMessage }
 */
export const validateForm = (formData, validationRules) => {
    const errors = {};

    for (const [field, validators] of Object.entries(validationRules)) {
        const error = validate(formData[field], validators);
        if (error) {
            errors[field] = error;
        }
    }

    return errors;
};
