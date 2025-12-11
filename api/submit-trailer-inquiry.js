import { trailerInquirySchema } from '../src/js/trailer-schema.js';

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

    // Send email to owner
    try {
      const ownerEmailPayload = {
        sender: {
          name: "Texas Tough Rentals Inquiry",
          email: process.env.EMAIL_SENDER,
        },
        to: [
          {
            email: process.env.EMAIL_RECIPIENT,
          },
        ],
        subject: "🚨 New Trailer Rental Inquiry",
        htmlContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 20px 0;">
                    <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      <!-- Header -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%); padding: 30px; text-align: center;">
                          <h1 style="color: #F5F5DC; margin: 0; font-size: 28px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">
                            ⚡ New Inquiry Alert!
                          </h1>
                          <p style="color: #F5F5DC; margin: 10px 0 0 0; font-size: 14px;">You have a new trailer rental request</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px;">
                          <h2 style="color: #333; margin: 0 0 20px 0; font-size: 22px; border-bottom: 3px solid #FFD700; padding-bottom: 10px;">
                            📋 Inquiry Details
                          </h2>
                          
                          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <tr>
                              <td style="padding: 12px; background-color: #8B0000; color: #F5F5DC; font-weight: bold; border: 1px solid #ddd;">Field</td>
                              <td style="padding: 12px; background-color: #8B0000; color: #F5F5DC; font-weight: bold; border: 1px solid #ddd;">Details</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">👤 Name</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.name}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">📞 Phone</td>
                              <td style="padding: 12px; border: 1px solid #ddd;"><a href="tel:${sanitizedData.phone}" style="color: #8B0000; text-decoration: none; font-weight: 600;">${sanitizedData.phone}</a></td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">📧 Email</td>
                              <td style="padding: 12px; border: 1px solid #ddd;"><a href="mailto:${sanitizedData.email}" style="color: #8B0000; text-decoration: none; font-weight: 600;">${sanitizedData.email}</a></td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">🏢 Company</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.company || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">🚛 Trailer</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333; font-weight: 600;">${sanitizedData['trailer-select']}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">🚚 Delivery</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.deliveryOption === 'ownTruck' ? 'Customer will pick up' : 'Delivery & pickup requested'}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">🔧 Use Case</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData['trailer-use-reason'] || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">📅 Pickup</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333; font-weight: 600;">${new Date(sanitizedData.pickupDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">📅 Drop-off</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333; font-weight: 600;">${new Date(sanitizedData.deliveryDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                            ${sanitizedData.additionalInfo ? `
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333; vertical-align: top;">💬 Additional Info</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.additionalInfo}</td>
                            </tr>
                            ` : ''}
                          </table>
                          
                          <div style="margin-top: 30px; padding: 20px; background-color: #fff9e6; border-left: 4px solid #FFD700; border-radius: 4px;">
                            <p style="margin: 0; color: #333; font-size: 14px;">
                              <strong>⏰ Action Required:</strong> Please respond to this inquiry within 1-2 business days.
                            </p>
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #333; padding: 20px; text-align: center;">
                          <p style="color: #F5F5DC; margin: 0; font-size: 12px;">
                            This is an automated notification from your Texas Tough Rentals website
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

      const ownerEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify(ownerEmailPayload),
      });

      if (!ownerEmailResponse.ok) {
        const errorBody = await ownerEmailResponse.json();
        console.error('Brevo API Error (Owner Email):', errorBody);
        throw new Error('Failed to send email to owner.');
      }

      // Send confirmation email to customer
      const customerEmailPayload = {
        sender: {
          name: "Texas Tough Rentals",
          email: process.env.EMAIL_SENDER,
        },
        to: [
          {
            email: sanitizedData.email,
            name: sanitizedData.name,
          },
        ],
        subject: "✅ Your Inquiry Has Been Received - Texas Tough Rentals",
        htmlContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f4f4;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 20px 0;">
                    <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      
                      <!-- Header with Logo -->
                      <tr>
                        <td style="background: linear-gradient(135deg, #8B0000 0%, #A52A2A 100%); padding: 40px 30px; text-align: center;">
                          <div style="background-color: rgba(255,255,255,0.1); display: inline-block; padding: 15px 30px; border-radius: 8px; margin-bottom: 15px;">
                            <h1 style="color: #F5F5DC; margin: 0; font-size: 32px; font-weight: bold; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                              TEXAS TOUGH RENTALS
                            </h1>
                          </div>
                          <p style="color: #FFD700; margin: 10px 0 0 0; font-size: 16px; font-weight: 600; letter-spacing: 2px;">
                            ⚡ BUILT FOR THE TOUGH JOBS! ⚡
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Success Badge -->
                      <tr>
                        <td style="padding: 30px 30px 0 30px; text-align: center;">
                          <div style="display: inline-block; background-color: #4CAF50; color: white; padding: 12px 30px; border-radius: 50px; font-size: 18px; font-weight: bold; margin-bottom: 20px;">
                            ✅ Inquiry Received Successfully
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Main Content -->
                      <tr>
                        <td style="padding: 20px 40px 40px 40px;">
                          <h2 style="color: #333; margin: 0 0 20px 0; font-size: 24px;">
                            Hi ${sanitizedData.name}! 👋
                          </h2>
                          
                          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Thank you for reaching out to <strong style="color: #8B0000;">Texas Tough Rentals</strong>! We've received your trailer rental inquiry and we're excited to help you with your project.
                          </p>
                          
                          <div style="background-color: #fff9e6; border-left: 4px solid #FFD700; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #333; font-size: 15px;">
                              <strong>⏰ Response Time:</strong> We will get back to you within <strong style="color: #8B0000;">1-2 business days</strong>.
                            </p>
                          </div>
                          
                          <h3 style="color: #333; margin: 30px 0 15px 0; font-size: 20px; border-bottom: 3px solid #8B0000; padding-bottom: 10px;">
                            📋 Your Inquiry Details
                          </h3>
                          
                          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; width: 40%; border: 1px solid #ddd; color: #333;">Name</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.name}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">Phone</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.phone}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">Email</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.email}</td>
                            </tr>
                            ${sanitizedData.company ? `
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">Company</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.company}</td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">Trailer</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333; font-weight: 600;">${sanitizedData['trailer-select']}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">Delivery Option</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.deliveryOption === 'ownTruck' ? 'I will pick up with my own truck' : 'Please deliver and pick up the trailer'}</td>
                            </tr>
                            ${sanitizedData['trailer-use-reason'] ? `
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">Intended Use</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData['trailer-use-reason']}</td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">Pickup Date & Time</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333; font-weight: 600; color: #8B0000;">${new Date(sanitizedData.pickupDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333;">Drop-off Date & Time</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333; font-weight: 600; color: #8B0000;">${new Date(sanitizedData.deliveryDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                            ${sanitizedData.additionalInfo ? `
                            <tr>
                              <td style="padding: 12px; background-color: #f9f9f9; font-weight: 600; border: 1px solid #ddd; color: #333; vertical-align: top;">Additional Info</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333;">${sanitizedData.additionalInfo}</td>
                            </tr>
                            ` : ''}
                          </table>
                          
                          <div style="background-color: #f0f0f0; padding: 20px; margin-top: 30px; border-radius: 8px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #333; font-size: 15px; font-weight: 600;">
                              📞 Need to reach us immediately?
                            </p>
                            <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.8;">
                              Call us at <a href="tel:+16822334986" style="color: #8B0000; text-decoration: none; font-weight: bold;">+1 (682) 233-4986</a><br>
                              Email us at <a href="mailto:texastoughrentals@gmail.com" style="color: #8B0000; text-decoration: none; font-weight: bold;">texastoughrentals@gmail.com</a>
                            </p>
                          </div>
                          
                          <p style="margin-top: 30px; color: #555; font-size: 15px; line-height: 1.6;">
                            We look forward to serving you!
                          </p>
                          
                          <p style="margin-top: 20px; color: #333; font-size: 15px;">
                            <strong>Best regards,</strong><br>
                            <span style="color: #8B0000; font-weight: bold;">The Texas Tough Rentals Team</span>
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Footer with Contact Info -->
                      <tr>
                        <td style="background-color: #333; padding: 30px; text-align: center;">
                          <h3 style="color: #FFD700; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">
                            TEXAS TOUGH RENTALS
                          </h3>
                          <p style="color: #F5F5DC; margin: 5px 0; font-size: 14px;">
                            📍 Keller, TX
                          </p>
                          <p style="color: #F5F5DC; margin: 5px 0; font-size: 14px;">
                            📞 <a href="tel:+16822334986" style="color: #F5F5DC; text-decoration: none;">+1 (682) 233-4986</a>
                          </p>
                          <p style="color: #F5F5DC; margin: 5px 0; font-size: 14px;">
                            📧 <a href="mailto:texastoughrentals@gmail.com" style="color: #F5F5DC; text-decoration: none;">texastoughrentals@gmail.com</a>
                          </p>
                          <p style="color: #FFD700; margin: 15px 0 5px 0; font-size: 13px; font-weight: 600; letter-spacing: 1px;">
                            ⚡ BUILT FOR THE TOUGH JOBS! ⚡
                          </p>
                          <p style="color: #999; margin: 15px 0 0 0; font-size: 11px;">
                            This is an automated confirmation email. Please do not reply to this message.
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

      const customerEmailResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.BREVO_API_KEY,
        },
        body: JSON.stringify(customerEmailPayload),
      });

      if (!customerEmailResponse.ok) {
        const errorBody = await customerEmailResponse.json();
        console.error('Brevo API Error (Customer Email):', errorBody);
        // Don't throw error here - still consider submission successful
      }

    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return response.status(200).json({ success: true, message: 'Inquiry submitted, but there was an issue with email notification.' });
    }

    return response.status(200).json({ success: true, message: 'Trailer inquiry submitted successfully. Check your email for confirmation.' });

  } catch (error) {
    console.error('Error processing trailer inquiry:', error);
    return response.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
}

const apiKey = process.env.BREVO_API_KEY;

if (!apiKey) {
  throw new Error('BREVO_API_KEY is not configured');
}
