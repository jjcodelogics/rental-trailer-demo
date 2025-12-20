/**
 * Booking Confirmation Handler
 * Processes booking confirmation from URL parameters and sends API request
 */

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const bookingData = {
    customerName: urlParams.get('name'),
    customerEmail: urlParams.get('email'),
    trailerName: urlParams.get('trailer'),
    pickupDate: urlParams.get('pickup'),
    deliveryDate: urlParams.get('delivery')
};

// Validate parameters
if (!bookingData.customerName || !bookingData.customerEmail || !bookingData.trailerName || 
    !bookingData.pickupDate || !bookingData.deliveryDate) {
    document.getElementById('loading').classList.add('hidden');
    document.getElementById('error').classList.remove('hidden');
    document.getElementById('errorMessage').textContent = 'Invalid booking parameters. Missing required information.';
} else {
    // Send confirmation request
    fetch('/api/confirm-booking', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('loading').classList.add('hidden');
        if (data.success) {
            document.getElementById('success').classList.remove('hidden');
        } else {
            document.getElementById('error').classList.remove('hidden');
            document.getElementById('errorMessage').textContent = data.message || 'Failed to send acceptance email.';
        }
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('loading').classList.add('hidden');
        document.getElementById('error').classList.remove('hidden');
        document.getElementById('errorMessage').textContent = 'Network error. Please check your connection and try again.';
    });
}
