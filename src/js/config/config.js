/**
 * Business Configuration
 * Central configuration object shared across all pages
 * Contains business information, contact details, and branding
 * 
 * @module config/config
 * @constant {Object} businessConfig
 */

/**
 * Business configuration object
 * @type {Object}
 * @property {string} name - Business name
 * @property {string} phone - Formatted phone number for display
 * @property {string} phoneRaw - Raw phone number in E.164 format
 * @property {Object} address - Business address details
 * @property {Object} location - GPS coordinates
 * @property {string[]} serviceArea - List of cities served
 * @property {Object} social - Social media and map links
 * @property {string} siteUrl - Production website URL
 */
export const businessConfig = {
  name: 'Texas Tough Rentals',
  phone: '(682) 233-4986',
  phoneRaw: '+16822334986',
  address: {
    street: 'Keller',
    city: 'Keller',
    state: 'TX',
    zip: '76244',
    country: 'US'
  },
  location: {
    latitude: 32.8423335,
    longitude: -97.3084444
  },
  serviceArea: [
    'Keller',
    'Fort Worth',
    'Southlake',
    'Hurst',
    'Euless',
    'Saginaw',
    'Roanoke',
    'Colleyville',
    'North Richland Hills'
  ],
  social: {
    facebook: 'https://www.facebook.com/texastoughrentals',
    googleMaps: 'https://www.google.com/maps/place/Texas+Tough+Rentals,+LLC/@32.8423335,-97.3084444,10z/data=!3m1!4b1!4m6!3m5!1s0x65f3105164e8ded3:0x2b8daa3ac68f31d7!8m2!3d32.8423335!4d-97.3084444!16s%2Fg%2F11yf6g9kt6'
  },
  siteUrl: 'https://texastoughrentals.com'
};
