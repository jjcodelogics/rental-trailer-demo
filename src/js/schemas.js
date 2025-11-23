/**
 * Zod schemas for form validation and sanitization
 * Zod is loaded via Import Map in the HTML files
 */

import { z } from 'zod';

/**
 * Inquiry form schema
 * Validates and sanitizes user input for rental inquiries
 */
export const inquirySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  
  email: z.string()
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  
  phone: z.string()
    .regex(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/, 
      'Please enter a valid phone number (e.g., 555-123-4567)')
    .trim(),
  
  trailerType: z.enum(['utility', 'enclosed', 'flatbed', 'dump', 'car-hauler'], {
    errorMap: () => ({ message: 'Please select a valid trailer type' })
  }),
  
  rentalDate: z.string()
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Rental date must be today or in the future'),
  
  duration: z.coerce.number()
    .int('Duration must be a whole number')
    .min(1, 'Rental duration must be at least 1 day')
    .max(30, 'Maximum rental duration is 30 days'),
  
  message: z.string()
    .max(500, 'Message must be less than 500 characters')
    .trim()
    .optional()
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
