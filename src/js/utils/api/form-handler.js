import { trailerInquirySchema } from '../validation/trailer-schema.js';

const SUCCESS_MESSAGE_DURATION = 10000;

export function handleInquiryForm() {
    const form = document.getElementById('inquiryForm');
    const successMessage = document.getElementById('successMessage');
    const submitButton = form?.querySelector('button[type="submit"]');

    if (!form) {
        console.error('Form not found: #inquiryForm');
        return;
    }
    
    console.log('Form handler initialized successfully');

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
        console.log('Form submitted');

        form.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = 'Submitting...';
        }

        try {
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            
            // Check if terms and conditions checkbox is checked
            const agreeTermsCheckbox = document.getElementById('agreeTerms');
            const agreeTermsError = document.getElementById('agreeTermsError');
            
            if (!agreeTermsCheckbox.checked) {
                if (agreeTermsError) {
                    agreeTermsError.textContent = 'You must agree to the Terms & Conditions to continue';
                }
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Request these dates';
                }
                return;
            }
            
            // Clear the error if checkbox is checked
            if (agreeTermsError) {
                agreeTermsError.textContent = '';
            }

            const validation = trailerInquirySchema.safeParse(data);
            if (!validation.success) {
                console.log('Validation failed:', validation.error.errors);
                validation.error.errors.forEach((err) => {
                    const fieldName = err.path[0];
                    const errorField = document.getElementById(`${fieldName}Error`);
                    if (errorField) {
                        errorField.textContent = err.message;
                    }
                });
                
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Request these dates';
                }
                return;
            }
            
            console.log('Validation passed, submitting to API');

            const response = await fetch('/api/submit-trailer-inquiry', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            // Check if response is JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                throw new Error('Server configuration error. Please contact support at +1 682-233-4986');
            }

            const result = await response.json();

            if (!response.ok) {
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

            successMessage.style.display = 'block';
            form.reset();
            
            successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

            setTimeout(() => {
                successMessage.style.display = 'none';
            }, SUCCESS_MESSAGE_DURATION);

        } catch (error) {
            alert(error.message || 'An unexpected error occurred. Please try again.');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = 'Request these dates';
            }
        }
    });
}