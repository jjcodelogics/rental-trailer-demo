# API Documentation

## Overview

This document describes the serverless API functions used in the Texas Tough Rentals application.

## Endpoints

### 1. Submit Trailer Inquiry

**Endpoint:** `/api/submit-trailer-inquiry.js`

**Method:** POST

**Description:** Handles trailer rental inquiry form submissions from the website.

**Request Body:**
```json
{
  "name": "string (required)",
  "email": "string (required, valid email)",
  "phone": "string (required)",
  "company": "string (optional)",
  "trailer-select": "string (required)",
  "deliveryOption": "string (required, 'ownTruck' | 'deliverPickup')",
  "deliveryStreet": "string (conditional, required if deliverPickup)",
  "deliveryCity": "string (conditional, required if deliverPickup)",
  "deliveryState": "string (conditional, required if deliverPickup)",
  "deliveryZipcode": "string (conditional, required if deliverPickup)",
  "trailer-use-reason": "string (optional)",
  "dateRange": "string (required)",
  "pickupDate": "string (required)",
  "deliveryDate": "string (required)",
  "additionalInfo": "string (optional)"
}
```

**Response:**
- **200 OK**: Inquiry submitted successfully
- **400 Bad Request**: Validation error
- **500 Internal Server Error**: Server error

**Example:**
```javascript
const response = await fetch('/api/submit-trailer-inquiry', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
});
```

---

### 2. Confirm Booking

**Endpoint:** `/api/confirm-booking.js`

**Method:** POST

**Description:** Handles booking confirmation requests.

**Request Body:**
```json
{
  "email": "string (required)",
  "bookingId": "string (required)"
}
```

**Response:**
- **200 OK**: Booking confirmed
- **400 Bad Request**: Invalid booking data
- **404 Not Found**: Booking not found
- **500 Internal Server Error**: Server error

---

## Validation

All endpoints use **Zod** schemas for request validation. Validation schemas are defined in:
- `src/js/utils/validation/schemas.js`
- `src/js/utils/validation/trailer-schema.js`

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": "Additional error details (optional)"
}
```

## Environment Variables

Required environment variables:
- `EMAIL_SERVICE_API_KEY`: API key for email service
- `NOTIFICATION_EMAIL`: Email address for notifications
- `FROM_EMAIL`: Sender email address

## Rate Limiting

Currently no rate limiting is implemented. Consider adding for production:
- Max 10 requests per minute per IP
- Max 100 requests per hour per IP

## Future Improvements

- [ ] Add rate limiting
- [ ] Implement booking confirmation system
- [ ] Add email verification
- [ ] Create admin dashboard for managing inquiries
- [ ] Add SMS notifications
