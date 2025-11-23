/**
 * Zod schemas for form validation and sanitization
 * Zod is loaded via Import Map in the HTML files
 */

import { z } from 'zod';

/**
 * Simple string sanitizer to escape angle brackets and normalize whitespace
 */
function sanitizeString(s) {
  if (typeof s !== 'string') return s;
  return s.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\s+/g, ' ').trim();
}

/**
 * Inquiry form schema
 * Validates and sanitizes user input for rental inquiries
 */
export const inquirySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .transform(sanitizeString),

  phone: z.string()
    .min(7, 'Please enter a valid phone number')
    .max(30, 'Phone number is too long')
    .transform(s => (typeof s === 'string' ? s.replace(/[^0-9+()\.\-\s]/g, '').trim() : s)),

  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim()
    .transform(sanitizeString),

  company: z.string()
    .max(100, 'Company name must be less than 100 characters')
    .trim()
    .optional()
    .transform(s => (s ? sanitizeString(s) : undefined)),

  pickupLocation: z.string()
    .min(2, 'Pickup location must be at least 2 characters')
    .max(200, 'Pickup location is too long')
    .trim()
    .transform(sanitizeString),

  pickupDate: z.string()
    .nonempty('Pickup date/time is required'),

  deliveryLocation: z.string()
    .min(2, 'Delivery location must be at least 2 characters')
    .max(200, 'Delivery location is too long')
    .trim()
    .transform(sanitizeString),

  deliveryDate: z.string()
    .nonempty('Delivery date/time is required'),

  dimensions: z.string()
    .max(200, 'Dimensions input is too long')
    .trim()
    .optional()
    .transform(s => (s ? sanitizeString(s) : undefined)),

  weight: z.coerce.number()
    .positive('Total weight must be a positive number')
    .optional(),

  additionalInfo: z.string()
    .max(1000, 'Additional information must be less than 1000 characters')
    .trim()
    .optional()
    .transform(s => (s ? sanitizeString(s) : undefined))
})
.superRefine((obj, ctx) => {
  // Validate pickup/delivery datetimes and ordering
  const now = new Date();
  now.setSeconds(0, 0);

  const pickup = new Date(obj.pickupDate);
  const delivery = new Date(obj.deliveryDate);

  if (isNaN(pickup.getTime())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Pickup date/time is invalid', path: ['pickupDate'] });
  } else if (pickup < now) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Pickup date/time must be in the future', path: ['pickupDate'] });
  }

  if (isNaN(delivery.getTime())) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Delivery date/time is invalid', path: ['deliveryDate'] });
  } else if (!isNaN(pickup.getTime()) && delivery < pickup) {
    ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Delivery date/time must be after pickup date/time', path: ['deliveryDate'] });
  }
});

/**
 * Contact form schema
 * Validates and sanitizes general contact form submissions
 */
export const contactSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  
  subject: z.string()
    .min(3, 'Subject must be at least 3 characters')
    .max(150, 'Subject must be less than 150 characters')
    .trim(),
  
  message: z.string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000, 'Message must be less than 1000 characters')
    .trim()
});

/**
 * Helper function to validate and sanitize form data
 * @param {z.ZodSchema} schema - Zod schema to validate against
 * @param {Object} data - Form data to validate
 * @returns {Object} - { success: boolean, data?: Object, errors?: Object }
 */
export function validateFormData(schema, data) {
  try {
    const validData = schema.parse(data);
    return { success: true, data: validData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = {};
      error.errors.forEach((err) => {
        const field = err.path[0];
        errors[field] = err.message;
      });
      return { success: false, errors };
    }
    return { success: false, errors: { general: 'Validation failed' } };
  }
}
