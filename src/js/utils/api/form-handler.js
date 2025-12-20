/**
 * Inquiry Form Handler
 * Manages trailer rental inquiry form submission with client-side validation
 * 
 * @module utils/api/form-handler
 * @requires ../validation/trailer-schema
 */

import { trailerInquirySchema } from '../validation/trailer-schema.js';

/**
 * Success message display duration in milliseconds
 * @constant {number}
 */
const SUCCESS_MESSAGE_DURATION = 10000;

/**
 * Initializes and handles the inquiry form submission process
 * - Sets minimum date/time constraints
 * - Validates form data using Zod schema
 * - Submits data to serverless API
 * - Displays success/error messages
 * 
 * @function handleInquiryForm
 * @returns {void}
 * @example
 * // Initialize form handler on page load
 * handleInquiryForm();
 */
export function handleInquiryForm() {
    const form = document.getElementById('inquiryForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = form?.querySelector('button[type="submit"]');

    // Early return if form doesn't exist
    if (!form) return;

    // Set minimum date/time to current time for date fields
    const pickupDateInput = document.getElementById('pickupDate');
    const deliveryDateInput = document.getElementById('deliveryDate');
    
    if (pickupDateInput || deliveryDateInput) {
        const now = new Date();
        const minDateTime = now.toISOString().slice(0, 16);
        
        if (pickupDateInput) {
            pickupDateInput.min = minDateTime;
        }
        if (deliveryDateInput) {
            deliveryDateInput.min = minDateTime;
        }
    }

    /**
     * Handle form submission event
     * @param {Event} event - Form submit event
     */
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Clear previous validation errors
        form.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));

        // Disable submit button during processing
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
        }

        try {
            // Collect and transform form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Perform client-side validation using Zod schema
            const validation = trailerInquirySchema.safeParse(data);
            if (!validation.success) {
                // Display validation errors inline
                validation.error.errors.forEach((err) => {
                    const fieldName = err.path[0];
                    const errorField = document.getElementById(`${fieldName}Error`);
                    if (errorField) {
                        errorField.textContent = err.message;
                    }
                });
                return;
            }

            // Submit validated data to API endpoint
            const response = await fetch('/api/submit-trailer-inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle server-side validation errors
                if (result.errors) {
                    Object.entries(result.errors).forEach(([field, message]) => {
                        const errorField = document.getElementById(`${field}Error`);
                        if (errorField) {
                            errorField.textContent = message;
                        }
                    });
                    throw new Error('Please correct the errors and try again.');
                } else {
                    throw new Error(result.message || 'Failed to submit inquiry. Please try again later.');
                }
            }

            // Show success message and reset form
            successMessage.style.display = 'block';
            form.reset();
            
            // Scroll to success message for user visibility
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Auto-hide success message after timeout
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, SUCCESS_MESSAGE_DURATION);

        } catch (error) {
            alert(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            // Re-enable submit button
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Inquiry';
            }
        }
    });
}