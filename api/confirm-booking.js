/**
 * Confirm Booking API Handler
 * Sends booking confirmation email to customer after rental request is accepted
 * 
 * @module api/handlers/confirm-booking
 * @requires process.env.BREVO_API_KEY - Brevo email service API key
 * @requires process.env.EMAIL_SENDER - Verified sender email address
 * 
 * @endpoint POST /api/confirm-booking
 * @param {Object} request.body - Request payload
 * @param {string} request.body.customerName - Customer's full name
 * @param {string} request.body.customerEmail - Customer's email address
 * @param {string} request.body.trailerName - Name of the trailer being rented
 * @param {string} request.body.pickupDate - Pickup date/time (ISO format)
 * @param {string} request.body.deliveryDate - Delivery date/time (ISO format)
 * 
 * @returns {Object} JSON response with success status
 * @returns {number} 200 - Booking confirmation sent successfully
 * @returns {number} 400 - Missing required fields
 * @returns {number} 405 - Method not allowed (only POST accepted)
 * @returns {number} 500 - Server error or email service misconfiguration
 */
export default async function handler(request, response) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Check API key configuration
  if (!process.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not set in environment variables');
    return response.status(500).json({ success: false, message: 'Email service not configured' });
  }

  try {
    const { customerName, customerEmail, trailerName, pickupDate, deliveryDate } = request.body;

    // Validate required fields
    if (!customerName || !customerEmail || !trailerName || !pickupDate || !deliveryDate) {
      return response.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Format dates for human-readable display
    const formattedPickup = new Date(pickupDate).toLocaleString('en-US', { 
      dateStyle: 'full', 
      timeStyle: 'short' 
    });
    const formattedDelivery = new Date(deliveryDate).toLocaleString('en-US', { 
      dateStyle: 'full', 
      timeStyle: 'short' 
    });

    // Send acceptance email to customer
    const acceptanceEmailPayload = {
      sender: {
        name: "Josh - Texas Tough Rentals",
        email: process.env.EMAIL_SENDER,
      },
      to: [
        {
          email: customerEmail,
          name: customerName,
        },
      ],
      subject: "✅ Your Trailer Rental Request Has Been Accepted!",
      htmlContent: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F1DE;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 20px 0;">
                  <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    
                    <!-- Header with Logo -->
                    <tr>
                      <td style="background-color: #333333; padding: 40px 30px; text-align: center; border-bottom: 4px solid #9B2226;">
                        <div style="background-color: rgba(155,34,38,0.15); display: inline-block; padding: 15px 30px; border-radius: 8px; margin-bottom: 15px; border: 2px solid #9B2226;">
                          <h1 style="color: #FFC300; margin: 0; font-size: 32px; font-weight: 700; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase; letter-spacing: 2px;">
                            TEXAS TOUGH RENTALS
                          </h1>
                        </div>
                        <p style="color: #FFC300; margin: 10px 0 0 0; font-size: 16px; font-weight: 600; letter-spacing: 2px;">
                          TOUGH BY DEFAULT
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Success Badge -->
                    <tr>
                      <td style="padding: 30px 30px 0 30px; text-align: center;">
                        <div style="display: inline-block; background-color: #22C55E; color: white; padding: 12px 30px; border-radius: 50px; font-size: 18px; font-weight: bold; margin-bottom: 20px; border: 2px solid #16A34A;">
                          ✅ REQUEST ACCEPTED
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                      <td style="padding: 20px 40px 40px 40px;">
                        <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase;">
                          Hi ${customerName}! 👋
                        </h2>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                          I've reviewed your trailer rental request and it's been <strong style="color: #22C55E;">accepted</strong> 👍
                        </p>
                        
                        <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 15px 0;">
                          The <strong style="color: #9B2226;">${trailerName}</strong> is available for your selected dates, and I'll be sending you an <strong>invoice shortly</strong> to lock everything in. Once the invoice is paid, your reservation is officially confirmed.
                        </p>
                        
                        <h3 style="color: #333333; margin: 30px 0 15px 0; font-size: 20px; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase; border-bottom: 3px solid #9B2226; padding-bottom: 10px;">
                          📋 What Happens Next:
                        </h3>
                        
                        <ul style="color: #555; font-size: 15px; line-height: 1.8; padding-left: 20px; margin: 20px 0;">
                          <li>You'll receive an <strong>invoice by email</strong></li>
                          <li>After payment, I'll confirm <strong>delivery & pickup details</strong></li>
                          <li>If anything needs adjusting, <strong>just let me know</strong></li>
                        </ul>
                        
                        <div style="background-color: #F4F1DE; padding: 20px; margin: 25px 0; border-radius: 8px; border: 2px solid #FFC300;">
                          <h4 style="color: #333333; margin: 0 0 10px 0; font-size: 16px; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase;">
                            📅 Your Rental Details:
                          </h4>
                          <p style="margin: 5px 0; color: #555; font-size: 14px;">
                            <strong>Trailer:</strong> ${trailerName}
                          </p>
                          <p style="margin: 5px 0; color: #555; font-size: 14px;">
                            <strong>Pickup:</strong> ${formattedPickup}
                          </p>
                          <p style="margin: 5px 0; color: #555; font-size: 14px;">
                            <strong>Drop-off:</strong> ${formattedDelivery}
                          </p>
                          <p style="margin: 5px 0; color: #555; font-size: 14px;">
                            <strong>Pickup Location:</strong> Walmart parking lot, 5336 Golden Triangle Blvd, Fort Worth, TX 76244
                          </p>
                        </div>
                        
                        <div style="background-color: #FFF9E6; border-left: 4px solid #FFC300; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                          <p style="margin: 0; color: #333333; font-size: 15px;">
                            If you have questions in the meantime or need to make a change, you can reach me directly at <a href="tel:+16822334986" style="color: #9B2226; text-decoration: none; font-weight: bold;">(682) 233-4986</a>.
                          </p>
                        </div>
                        
                        <p style="margin-top: 30px; color: #555; font-size: 15px; line-height: 1.6;">
                          Thanks for choosing <strong style="color: #9B2226;">Texas Tough Rentals</strong> — I appreciate the business.
                        </p>
                        
                        <p style="margin-top: 20px; color: #333333; font-size: 15px;">
                          <strong>— Josh</strong><br>
                          <span style="color: #9B2226; font-weight: bold; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase;">Texas Tough Rentals</span><br>
                          <span style="color: #666; font-size: 14px;">Keller, TX</span>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer with Contact Info -->
                    <tr>
                      <td style="background-color: #333333; padding: 30px; text-align: center; border-top: 4px solid #9B2226;">
                        <h3 style="color: #FFC300; margin: 0 0 15px 0; font-size: 18px; font-weight: 700; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase; letter-spacing: 2px;">
                          TEXAS TOUGH RENTALS
                        </h3>
                        <p style="color: #F4F1DE; margin: 5px 0; font-size: 14px;">
                          📍 Keller, TX
                        </p>
                        <p style="color: #F4F1DE; margin: 5px 0; font-size: 14px;">
                          📞 <a href="tel:+16822334986" style="color: #F4F1DE; text-decoration: none;">(682) 233-4986</a>
                        </p>
                        <p style="color: #F4F1DE; margin: 5px 0; font-size: 14px;">
                          📧 <a href="mailto:texastoughrentals@gmail.com" style="color: #F4F1DE; text-decoration: none;">texastoughrentals@gmail.com</a>
                        </p>
                        <p style="color: #FFC300; margin: 15px 0 5px 0; font-size: 13px; font-weight: 600; letter-spacing: 1px;">
                          ⚡ BUILT FOR THE TOUGH JOBS! ⚡
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    };

    const emailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY.trim(),
      },
      body: JSON.stringify(acceptanceEmailPayload),
    });

    if (!emailResponse.ok) {
      const errorBody = await emailResponse.json();
      console.error('Brevo API Error:', errorBody);
      throw new Error('Failed to send acceptance email');
    }

    return response.status(200).json({ 
      success: true, 
      message: 'Acceptance email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending acceptance email:', error);
    return response.status(500).json({ 
      success: false, 
      message: 'An unexpected error occurred while sending the email' 
    });
  }
}
