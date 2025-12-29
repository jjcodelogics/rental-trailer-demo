export function initDeliveryOption() {
  const deliveryRadios = document.querySelectorAll('input[name="deliveryOption"]');
  const deliveryAddressField = document.getElementById('deliveryAddressField');
  const deliveryStreetInput = document.getElementById('deliveryStreet');
  const deliveryCityInput = document.getElementById('deliveryCity');
  const deliveryZipcodeInput = document.getElementById('deliveryZipcode');
  
  if (!deliveryRadios.length || !deliveryAddressField) return;
  
  deliveryRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.value === 'deliverPickup') {
        deliveryAddressField.style.display = 'block';
        deliveryStreetInput.required = true;
        deliveryCityInput.required = true;
        deliveryZipcodeInput.required = true;
      } else {
        deliveryAddressField.style.display = 'none';
        deliveryStreetInput.required = false;
        deliveryCityInput.required = false;
        deliveryZipcodeInput.required = false;
        
        deliveryStreetInput.value = '';
        deliveryCityInput.value = '';
        deliveryZipcodeInput.value = '';
      }
    });
  });
}
