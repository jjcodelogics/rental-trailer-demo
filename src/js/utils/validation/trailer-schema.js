import { z } from 'zod';

/**
 * Robust string sanitizer to escape common HTML-sensitive characters and normalize whitespace
 */
function sanitizeString(s) {
  if (typeof s !== 'string') return s;
  // Normalize whitespace first
  let out = s.replace(/\s+/g, ' ').trim();
  // Escape special HTML characters to prevent injection when inserted into HTML
  out = out.replace(/&/g, '&amp;')
           .replace(/</g, '&lt;')
           .replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;')
           .replace(/'/g, '&#39;');
  return out;
}

/**
 * Trailer inquiry form schema
 * Validates and sanitizes user input for trailer rental inquiries
 */
export const trailerInquirySchema = z.object({
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

  'trailer-select': z.enum(['14900-lbs-dump-trailer'], {
    errorMap: () => ({ message: 'Invalid trailer selection.' })
  }),

  deliveryOption: z.enum(['ownTruck', 'deliverPickup'], {
    errorMap: () => ({ message: 'Please select a delivery option.' })
  }),

  deliveryStreet: z.string()
    .min(5, 'Street address must be at least 5 characters')
    .max(150, 'Street address must be less than 150 characters')
    .transform(sanitizeString)
    .optional()
    .refine(
      (val, ctx) => {
        const parent = ctx?.parent;
        if (parent?.deliveryOption === 'deliverPickup') {
          return val && val.length >= 5;
        }
        return true;
      },
      { message: 'Street address is required when delivery is selected' }
    ),

  deliveryCity: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters')
    .transform(sanitizeString)
    .optional()
    .refine(
      (val, ctx) => {
        const parent = ctx?.parent;
        if (parent?.deliveryOption === 'deliverPickup') {
          return val && val.length >= 2;
        }
        return true;
      },
      { message: 'City is required when delivery is selected' }
    ),

  deliveryState: z.string()
    .optional()
    .default('TX'),

  deliveryZipcode: z.string()
    .regex(/^\d{5}$/, 'Zipcode must be 5 digits')
    .optional()
    .refine(
      (val, ctx) => {
        const parent = ctx?.parent;
        if (parent?.deliveryOption === 'deliverPickup') {
          return val && /^\d{5}$/.test(val);
        }
        return true;
      },
      { message: 'Valid 5-digit zipcode is required when delivery is selected' }
    ),

  'trailer-use-reason': z.string().optional().transform(s => (s ? sanitizeString(s) : undefined)),

  pickupDate: z.string()
    .nonempty('Pickup date/time is required')
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid pickup date format'
    }),

  deliveryDate: z.string()
    .nonempty('Drop-off date/time is required')
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Invalid drop-off date format'
    }),

  additionalInfo: z.string()
    .max(1000, 'Additional information must be less than 1000 characters')
    .trim()
    .optional()
    .transform(s => (s ? sanitizeString(s) : undefined))
}).refine(data => {
    try {
        return new Date(data.deliveryDate) > new Date(data.pickupDate);
    } catch (e) {
        return false;
    }
}, {
  message: 'Drop-off date must be after pickup date.',
  path: ['deliveryDate'],
});

/**
 * Validates form data against a Zod schema and returns a structured result.
 * @param {z.ZodSchema} schema - The Zod schema to validate against.
 * @param {Object} formData - The form data to validate.
 * @returns {{success: boolean, data: Object|null, errors: Object|null}}
 */
export function validateFormData(schema, formData) {
  const result = schema.safeParse(formData);
  if (result.success) {
    return { success: true, data: result.data, errors: null };
  } else {
    const errors = result.error.flatten().fieldErrors;
    // Return the first error for each field
    const simplifiedErrors = Object.entries(errors).reduce((acc, [key, value]) => {
      acc[key] = value[0];
      return acc;
    }, {});
    return { success: false, data: null, errors: simplifiedErrors };
  }
}
