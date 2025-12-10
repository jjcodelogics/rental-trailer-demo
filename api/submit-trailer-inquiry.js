import { trailerInquirySchema } from '../../src/js/trailer-schema.js';

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const validation = trailerInquirySchema.safeParse(request.body);

    if (!validation.success) {
      const { errors } = validation.error;
      const errorMessages = {};
      for (const error of errors) {
        errorMessages[error.path[0]] = error.message;
      }
      return response.status(400).json({ success: false, errors: errorMessages });
    }

    const sanitizedData = validation.data;

    // Send email using Brevo
    try {
      const emailPayload = {
        sender: {
          name: "Texas Tough Rentals Inquiry",
          email: process.env.EMAIL_SENDER,
        },
        to: [
          {
            email: process.env.EMAIL_RECIPIENT,
          },
        ],
        subject: "New Trailer Rental Inquiry",
        htmlContent: `
          <html>
            <body>
              <h1>New Trailer Rental Inquiry</h1>
              <p><strong>Name:</strong> ${sanitizedData.name}</p>
              <p><strong>Phone:</strong> ${sanitizedData.phone}</p>
              <p><strong>Email:</strong> ${sanitizedData.email}</p>
              <p><strong>Company:</strong> ${sanitizedData.company || 'N/A'}</p>
              <p><strong>Trailer:</strong> ${sanitizedData['trailer-select']}</p>
              <p><strong>Delivery Option:</strong> ${sanitizedData.deliveryOption}</p>
              <p><strong>Intended Use:</strong> ${sanitizedData['trailer-use-reason'] || 'N/A'}</p>
              <p><strong>Pickup:</strong> ${sanitizedData.pickupDate}</p>
              <p><strong>Drop-off:</strong> ${sanitizedData.deliveryDate}</p>
              <p><strong>Additional Info:</strong> ${sanitizedData.additionalInfo || 'N/A'}</p>
            </body>
          </html>
        `,
      };

      const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify(emailPayload),
      });

      if (!emailResponse.ok) {
        const errorBody = await emailResponse.json();
        console.error('Brevo API Error:', errorBody);
        throw new Error('Failed to send email.');
      }

    } catch (emailError) {
      console.error('Error sending email:', emailError);
      // Still return success to the user, but log the email error
      return response.status(200).json({ success: true, message: 'Inquiry submitted, but there was an issue with email notification.' });
    }

    return response.status(200).json({ success: true, message: 'Trailer inquiry submitted successfully.' });

  } catch (error) {
    console.error('Error processing trailer inquiry:', error);
    return response.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
}
