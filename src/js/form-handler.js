import { z } from 'zod';

// Form validation schema
const inquirySchema = z.object({
    name: z.string().min(1, 'Name is required'),
    phone: z.string().min(1, 'Phone is required'),
    email: z.string().email('Invalid email address'),
    pickupDate: z.string().min(1, 'Pickup date is required'),
    deliveryDate: z.string().min(1, 'Delivery date is required'),
});

// Form handler function
export function handleInquiryForm() {
    const form = document.getElementById('inquiryForm');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Collect form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // Validate form data
        const validation = inquirySchema.safeParse(data);
        if (!validation.success) {
            // Display validation errors
            validation.error.errors.forEach((err) => {
                const errorField = document.getElementById(`${err.path[0]}Error`);
                if (errorField) errorField.textContent = err.message;
            });
            return;
        }

        // Clear previous errors
        form.querySelectorAll('.form-error').forEach((el) => (el.textContent = ''));

        try {
            // Send data to API
            const response = await fetch('https://api.example.com/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Failed to submit inquiry. Please try again later.');
            }

            // Simulate email sending via Brevo
            await sendEmail(data);

            // Show success message
            successMessage.style.display = 'block';
            form.reset();
        } catch (error) {
            alert(error.message);
        }
    });
}

// Simulate sending email via Brevo
async function sendEmail(data) {
    // Replace with actual Brevo API integration
    console.log('Sending email via Brevo with data:', data);
    return Promise.resolve();
}