import { QuoteSchema } from '../src/js/schemas.js';

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
    return res.status(400).json({ success: false, errors: error.errors });
  }
}