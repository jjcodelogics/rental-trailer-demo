import { trailerInquirySchema } from '../src/js/trailer-schema.js';

// Business address
const BUSINESS_ADDRESS = '8637 Shadow Trace Dr, Fort Worth, Texas 76244, United States';

/**
 * Geocode an address using OpenStreetMap Nominatim API
 * @param {string} address - Address to geocode
 * @returns {Promise<{lat: number, lon: number}|null>}
 */
async function geocodeAddress(address) {
  try {
    const url = new URL('https://nominatim.openstreetmap.org/search');
    url.searchParams.append('q', address);
    url.searchParams.append('format', 'json');
    url.searchParams.append('limit', '1');
    
    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'TexasToughRentals/1.0' // Required by Nominatim usage policy
      }
    });
    
    const data = await response.json();
    
    if (data && data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in miles
 */
function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance * 10) / 10; // Round to 1 decimal place
}

/**
 * Calculate distance from business address to delivery address
 * @param {string} deliveryAddress - Customer's delivery address
 * @returns {Promise<{distanceMiles: number}|null>}
 */
async function calculateDistance(deliveryAddress) {
  try {
    // Geocode both addresses
    const [businessCoords, deliveryCoords] = await Promise.all([
      geocodeAddress(BUSINESS_ADDRESS),
      geocodeAddress(deliveryAddress)
    ]);
    
    if (!businessCoords || !deliveryCoords) {
      console.warn('Could not geocode one or both addresses');
      return null;
    }
    
    const distanceMiles = calculateHaversineDistance(
      businessCoords.lat,
      businessCoords.lon,
      deliveryCoords.lat,
      deliveryCoords.lon
    );
    
    return { distanceMiles };
  } catch (error) {
    console.error('Distance calculation error:', error);
    return null;
  }
}

// In-memory rate limiter
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // 3 requests per minute

/**
 * Rate limiter function to prevent spam/abuse
 * @param {string} identifier - IP address or unique identifier
 * @returns {boolean} - true if allowed, false if rate limited
 */
function checkRateLimit(identifier) {
  const now = Date.now();
  const userRequests = rateLimitMap.get(identifier) || [];
  
  // Remove expired entries (older than the time window)
  const validRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  // Check if user has exceeded rate limit
  if (validRequests.length >= MAX_REQUESTS) {
    return false;
  }
  
  // Add current request timestamp
  validRequests.push(now);
  rateLimitMap.set(identifier, validRequests);
  
  // Cleanup old entries to prevent memory leaks
  if (rateLimitMap.size > 1000) {
    const entries = Array.from(rateLimitMap.entries());
    entries.forEach(([key, timestamps]) => {
      const valid = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
      if (valid.length === 0) {
        rateLimitMap.delete(key);
      }
    });
  }
  
  return true;
}

export default async function handler(request, response) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Validate Content-Type
  const contentType = request.headers['content-type'];
  if (!contentType || !contentType.includes('application/json')) {
    return response.status(415).json({ success: false, message: 'Content-Type must be application/json' });
  }

  // Rate limiting check
  const clientIp = request.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                   request.headers['x-real-ip'] || 
                   request.socket?.remoteAddress || 
                   'unknown';
  
  if (!checkRateLimit(clientIp)) {
    console.warn(`Rate limit exceeded for IP: ${clientIp}`);
    return response.status(429).json({ 
      success: false, 
      message: 'Too many requests. Please try again in a minute.' 
    });
  }

  // Check API key configuration
  if (!process.env.BREVO_API_KEY) {
    console.error('BREVO_API_KEY is not set in environment variables');
    return response.status(500).json({ success: false, message: 'Email service not configured' });
  }

  try {
    // Validate and sanitize input
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

    // Calculate distance if delivery address is provided
    let distanceInfo = null;
    if (sanitizedData.deliveryOption === 'deliverPickup' && sanitizedData.deliveryAddress) {
      distanceInfo = await calculateDistance(sanitizedData.deliveryAddress);
    }

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
            <body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #F4F1DE;">
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 20px 0;">
                    <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                      <!-- Header -->
                      <tr>
                        <td style="background-color: #333333; padding: 30px; text-align: center; border-bottom: 4px solid #9B2226;">
                          <h1 style="color: #FFC300; margin: 0; font-size: 28px; font-weight: 700; text-transform: uppercase; font-family: 'Oswald', 'Arial Black', sans-serif; letter-spacing: 1px;">
                            ⚡ New Inquiry Alert!
                          </h1>
                          <p style="color: #F4F1DE; margin: 10px 0 0 0; font-size: 14px;">You have a new trailer rental request</p>
                        </td>
                      </tr>
                      
                      <!-- Content -->
                      <tr>
                        <td style="padding: 40px 30px;">
                          <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 22px; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase; border-bottom: 3px solid #FFC300; padding-bottom: 10px;">
                            📋 Inquiry Details
                          </h2>
                          
                          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <tr>
                              <td style="padding: 12px; background-color: #9B2226; color: #F4F1DE; font-weight: bold; border: 1px solid #ddd;">Field</td>
                              <td style="padding: 12px; background-color: #9B2226; color: #F4F1DE; font-weight: bold; border: 1px solid #ddd;">Details</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">👤 Name</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.name}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">📞 Phone</td>
                              <td style="padding: 12px; border: 1px solid #ddd;"><a href="tel:${sanitizedData.phone}" style="color: #9B2226; text-decoration: none; font-weight: 600;">${sanitizedData.phone}</a></td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">📧 Email</td>
                              <td style="padding: 12px; border: 1px solid #ddd;"><a href="mailto:${sanitizedData.email}" style="color: #9B2226; text-decoration: none; font-weight: 600;">${sanitizedData.email}</a></td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">🏢 Company</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.company || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">🚛 Trailer</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333; font-weight: 600;">${sanitizedData['trailer-select']}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">🚚 Delivery</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.deliveryOption === 'ownTruck' ? 'Customer will pick up' : 'Delivery & pickup requested'}</td>
                            </tr>
                            ${sanitizedData.deliveryAddress ? `
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">📍 Delivery Address</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.deliveryAddress}</td>
                            </tr>
                            ` : ''}
                            ${distanceInfo ? `
                            <tr>
                              <td style="padding: 12px; background-color: #FFF9E6; font-weight: 600; border: 2px solid #FFC300; color: #333333;">📏 Distance</td>
                              <td style="padding: 12px; border: 2px solid #FFC300; background-color: #FFF9E6;">
                                <strong style="color: #9B2226; font-size: 18px;">${distanceInfo.distanceMiles} miles</strong><br>
                                <span style="color: #666; font-size: 13px;">From business location (straight line distance)</span>
                              </td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">🔧 Use Case</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData['trailer-use-reason'] || 'N/A'}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">📅 Pickup</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333; font-weight: 600;">${new Date(sanitizedData.pickupDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">📅 Drop-off</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333; font-weight: 600;">${new Date(sanitizedData.deliveryDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                            ${sanitizedData.additionalInfo ? `
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333; vertical-align: top;">💬 Additional Info</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.additionalInfo}</td>
                            </tr>
                            ` : ''}
                          </table>
                          
                          <div style="margin-top: 30px; padding: 20px; background-color: #FFF9E6; border-left: 4px solid #FFC300; border-radius: 4px;">
                            <p style="margin: 0; color: #333333; font-size: 14px;">
                              <strong>⏰ Action Required:</strong> Please respond to this inquiry within 1-2 business days.
                            </p>
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Footer -->
                      <tr>
                        <td style="background-color: #333333; padding: 20px; text-align: center; border-top: 4px solid #9B2226;">
                          <p style="color: #F4F1DE; margin: 0; font-size: 12px;">
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
        subject: "We have received your inquiry - Texas Tough Rentals",
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
                            ⚡ BUILT FOR THE TOUGH JOBS! ⚡
                          </p>
                        </td>
                      </tr>
                      
                      <!-- Success Badge -->
                      <tr>
                        <td style="padding: 30px 30px 0 30px; text-align: center;">
                          <div style="display: inline-block; background-color: #9B2226; color: #F4F1DE; padding: 12px 30px; border-radius: 50px; font-size: 18px; font-weight: bold; margin-bottom: 20px; border: 2px solid #FFC300;">
                            ✅ Inquiry Received Successfully
                          </div>
                        </td>
                      </tr>
                      
                      <!-- Main Content -->
                      <tr>
                        <td style="padding: 20px 40px 40px 40px;">
                          <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase;">
                            Hi ${sanitizedData.name}! 👋
                          </h2>
                          
                          <p style="color: #555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Thank you for reaching out to <strong style="color: #9B2226;">Texas Tough Rentals</strong>! We've received your trailer rental inquiry and we're excited to help you with your project.
                          </p>
                          
                          <div style="background-color: #FFF9E6; border-left: 4px solid #FFC300; padding: 15px 20px; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #333333; font-size: 15px;">
                              <strong>⏰ Response Time:</strong> We will get back to you within <strong style="color: #9B2226;">1-2 business days</strong>.
                            </p>
                          </div>
                          
                          <h3 style="color: #333333; margin: 30px 0 15px 0; font-size: 20px; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase; border-bottom: 3px solid #9B2226; padding-bottom: 10px;">
                            📋 Your Inquiry Details
                          </h3>
                          
                          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; width: 40%; border: 1px solid #ddd; color: #333333;">Name</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.name}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">Phone</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.phone}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">Email</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.email}</td>
                            </tr>
                            ${sanitizedData.company ? `
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">Company</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.company}</td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">Trailer</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333; font-weight: 600;">${sanitizedData['trailer-select']}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">Delivery Option</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.deliveryOption === 'ownTruck' ? 'I will pick up with my own truck' : 'Please deliver and pick up the trailer'}</td>
                            </tr>
                            ${sanitizedData['trailer-use-reason'] ? `
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">Intended Use</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData['trailer-use-reason']}</td>
                            </tr>
                            ` : ''}
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">Pickup Date & Time</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #9B2226; font-weight: 600;">${new Date(sanitizedData.pickupDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333;">Drop-off Date & Time</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #9B2226; font-weight: 600;">${new Date(sanitizedData.deliveryDate).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
                            </tr>
                            ${sanitizedData.additionalInfo ? `
                            <tr>
                              <td style="padding: 12px; background-color: #F4F1DE; font-weight: 600; border: 1px solid #ddd; color: #333333; vertical-align: top;">Additional Info</td>
                              <td style="padding: 12px; border: 1px solid #ddd; color: #333333;">${sanitizedData.additionalInfo}</td>
                            </tr>
                            ` : ''}
                          </table>
                          
                          <div style="background-color: #F4F1DE; padding: 20px; margin-top: 30px; border-radius: 8px; text-align: center; border: 2px solid #FFC300;">
                            <p style="margin: 0 0 15px 0; color: #333333; font-size: 15px; font-weight: 600; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase;">
                              📞 Need to reach us immediately?
                            </p>
                            <p style="margin: 0; color: #555; font-size: 14px; line-height: 1.8;">
                              Call us at <a href="tel:+16822334986" style="color: #9B2226; text-decoration: none; font-weight: bold;">+1 (682) 233-4986</a><br>
                              Email us at <a href="mailto:texastoughrentals@gmail.com" style="color: #9B2226; text-decoration: none; font-weight: bold;">texastoughrentals@gmail.com</a>
                            </p>
                          </div>
                          
                          <p style="margin-top: 30px; color: #555; font-size: 15px; line-height: 1.6;">
                            We look forward to serving you!
                          </p>
                          
                          <p style="margin-top: 20px; color: #333333; font-size: 15px;">
                            <strong>Best regards,</strong><br>
                            <span style="color: #9B2226; font-weight: bold; font-family: 'Oswald', 'Arial Black', sans-serif; text-transform: uppercase;">The Texas Tough Rentals Team</span>
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
                            📞 <a href="tel:+16822334986" style="color: #F4F1DE; text-decoration: none;">+1 (682) 233-4986</a>
                          </p>
                          <p style="color: #F4F1DE; margin: 5px 0; font-size: 14px;">
                            📧 <a href="mailto:texastoughrentals@gmail.com" style="color: #F4F1DE; text-decoration: none;">texastoughrentals@gmail.com</a>
                          </p>
                          <p style="color: #FFC300; margin: 15px 0 5px 0; font-size: 13px; font-weight: 600; letter-spacing: 1px;">
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
          'api-key': process.env.BREVO_API_KEY.trim(),
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


