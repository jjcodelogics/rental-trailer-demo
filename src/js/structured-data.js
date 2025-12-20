/**
 * Structured Data (Schema.org JSON-LD)
 * Provides SEO-friendly structured data for search engines
 * 
 * @module structured-data
 * @requires ./config
 * @see https://schema.org/
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import { businessConfig } from './config.js';

/**
 * Local Business Schema
 * Defines business information in Schema.org format
 * 
 * @type {Object}
 * @property {string} @context - Schema.org context
 * @property {string} @type - Schema type (LocalBusiness)
 * @property {string} name - Business name
 * @property {Object} address - Postal address details
 * @property {Object} geo - Geographic coordinates
 * @property {Object} openingHoursSpecification - Operating hours
 * @property {Object} aggregateRating - Customer ratings
 */
export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": businessConfig.name,
  "image": `${businessConfig.siteUrl}/images/logo.jpg`,
  "@id": businessConfig.siteUrl,
  "url": businessConfig.siteUrl,
  "telephone": businessConfig.phoneRaw,
  "priceRange": "$$",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": businessConfig.address.street,
    "addressLocality": businessConfig.address.city,
    "addressRegion": businessConfig.address.state,
    "postalCode": businessConfig.address.zip,
    "addressCountry": businessConfig.address.country
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": businessConfig.location.latitude,
    "longitude": businessConfig.location.longitude
  },
  "openingHoursSpecification": {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday"
    ],
    "opens": "00:00",
    "closes": "23:59"
  },
  "sameAs": [
    businessConfig.social.facebook,
    businessConfig.social.googleMaps
  ],
  "areaServed": businessConfig.serviceArea.map(city => ({
    "@type": "City",
    "name": city
  })),
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "5",
    "reviewCount": "3"
  }
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": "Dump Trailer Rental",
  "provider": {
    "@type": "LocalBusiness",
    "name": businessConfig.name
  },
  "areaServed": {
    "@type": "GeoCircle",
    "geoMidpoint": {
      "@type": "GeoCoordinates",
      "latitude": businessConfig.location.latitude,
      "longitude": businessConfig.location.longitude
    },
    "geoRadius": "48280"
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "Dump Trailer Rental Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "14,000 lb Dump Trailer - 1 Day Rental",
          "description": "Heavy-duty 14k dump trailer rental for construction, gravel delivery, and cleanups"
        },
        "price": "130",
        "priceCurrency": "USD"
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Product",
          "name": "14,000 lb Dump Trailer - 2-6 Day Rental",
          "description": "Heavy-duty 14k dump trailer rental for extended projects"
        },
        "price": "95",
        "priceCurrency": "USD"
      }
    ]
  }
};

export function createBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}
