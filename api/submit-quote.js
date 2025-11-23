import { inquirySchema as QuoteSchema } from '../src/js/schemas.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // This runs the same Sanitization + Validation as the frontend
    // If a hacker bypassed the frontend, this protects your database.
    const validatedData = QuoteSchema.parse(req.body);

    console.log("Received Quote:", validatedData);

    // TODO: Send email using validatedData.name, validatedData.pickupLocation, etc.

    return res.status(200).json({ success: true, message: "Quote received" });

  } catch (error) {
    // If this is a ZodError, convert to field -> message map
    if (error && error.errors && Array.isArray(error.errors)) {
      const errors = {};
      error.errors.forEach((err) => {
        const field = err.path && err.path.length ? err.path[0] : 'general';
        // prefer first error message for the field
        errors[field] = errors[field] || err.message;
      });
      return res.status(400).json({ success: false, errors });
    }

    return res.status(400).json({ success: false, errors: { general: 'Validation failed' } });
  }
}