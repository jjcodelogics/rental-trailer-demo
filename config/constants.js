/**
 * Business Configuration Constants
 * Centralized configuration for business information and settings
 */

export const BUSINESS_CONFIG = {
  name: 'Texas Tough Rentals',
  phone: '+1-682-233-4986',
  phoneDisplay: '(682) 233-4986',
  email: 'texastoughrentals@gmail.com',
  location: {
    city: 'Watauga',
    state: 'TX',
    serviceArea: ['Keller', 'Fort Worth', 'Southlake', 'Watauga', 'North Richland Hills']
  },
  social: {
    // Add social media links when available
    facebook: '',
    instagram: '',
    twitter: ''
  },
  website: 'https://texastoughrentals.com'
};

export const TRAILER_CONFIG = {
  name: '14,900 lbs Dump Trailer',
  shortName: '14,900 lbs Dump Trailer',
  capacity: 14900,
  pricing: {
    halfDay: 70,
    fullDay: 130,
    currency: 'USD'
  },
  features: [
    'Hydraulic lift',
    'Spreader gate',
    'Heavy-duty construction',
    'Easy to tow',
    'Perfect for gravel, debris, and construction materials'
  ]
};

export const FORM_CONFIG = {
  maxNameLength: 100,
  maxPhoneLength: 30,
  maxCompanyLength: 100,
  maxMessageLength: 1000,
  minNameLength: 2,
  minPhoneLength: 7
};

export const API_ENDPOINTS = {
  submitInquiry: '/api/submit-trailer-inquiry',
  confirmBooking: '/api/confirm-booking'
};

export const CACHE_CONFIG = {
  images: 31536000, // 1 year in seconds
  staticAssets: 31536000, // 1 year in seconds
  html: 0 // No cache for HTML
};
