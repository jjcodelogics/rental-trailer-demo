import { trailerInquirySchema } from '../validation/trailer-schema.js';

// Form handler function
export function handleInquiryForm() {
    const form = document.getElementById('inquiryForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = form?.querySelector('button[type="submit"]');

    if (!form) return;

    // Set minimum date/time to now for date fields
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

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Clear previous errors
        form.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));

        // Disable submit button during processing
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
        }

        try {
            // Collect form data
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Validate form data on client side
            const validation = trailerInquirySchema.safeParse(data);
            if (!validation.success) {
                // Display validation errors
                validation.error.errors.forEach((err) => {
                    const fieldName = err.path[0];
                    const errorField = document.getElementById(`${fieldName}Error`);
                    if (errorField) {
                        errorField.textContent = err.message;
                    }
                });
                return;
            }

            // Send data to API
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
            
            // Scroll to success message
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Hide success message after 10 seconds
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 10000);

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