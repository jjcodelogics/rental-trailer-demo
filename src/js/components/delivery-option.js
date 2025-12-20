/**
 * Delivery Option Component
 * Handles conditional display of delivery address fields based on user selection
 * 
 * @module components/delivery-option
 */

/**
 * Initializes delivery option toggle functionality
 * Shows/hides delivery address fields based on radio button selection
 * Manages field validation requirements dynamically
 * 
 * @function initDeliveryOption
 * @returns {void}
 * @example
 * // Initialize on trailer rental page
 * initDeliveryOption();
 */
export function initDeliveryOption() {
  const deliveryRadios = document.querySelectorAll('input[name="deliveryOption"]');
  const deliveryAddressField = document.getElementById('deliveryAddressField');
  const deliveryStreetInput = document.getElementById('deliveryStreet');
  const deliveryCityInput = document.getElementById('deliveryCity');
  const deliveryZipcodeInput = document.getElementById('deliveryZipcode');
  
  // Early return if required elements not found
  if (!deliveryRadios.length || !deliveryAddressField) return;
  
  deliveryRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'deliverPickup') {
        // Show delivery address fields and make them required
        deliveryAddressField.style.display = 'block';
        deliveryStreetInput.required = true;
        deliveryCityInput.required = true;
        deliveryZipcodeInput.required = true;
      } else {
        // Hide and clear delivery address fields
        deliveryAddressField.style.display = 'none';
        deliveryStreetInput.required = false;
        deliveryCityInput.required = false;
        deliveryZipcodeInput.required = false;
        
        // Reset field values
        deliveryStreetInput.value = '';
        deliveryCityInput.value = '';
        deliveryZipcodeInput.value = '';
      }
    });
  });
}
