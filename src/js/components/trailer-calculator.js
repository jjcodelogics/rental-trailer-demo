// src/js/components/trailer-calculator.js

export function initTrailerCalculator() {
  const form = document.getElementById('trailer-calculator-form');
  const result = document.getElementById('trailer-calculator-result');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    // Get form values
    const days = parseInt(form.days.value, 10);
    const needDropOff = form.dropoff.value === 'company';
    const needPickup = form.pickup.value === 'company';
    const dump = form.dump.value === 'yes';
    const zipcode = form.zipcode.value.trim();

    // Pricing tiers
    let dailyRate = 130;
    if (days >= 30) dailyRate = 70;
    else if (days >= 7) dailyRate = 85;
    else if (days >= 2) dailyRate = 95;

    let rentalCost = days * dailyRate;
    let dropOffCost = 0;
    let pickupCost = 0;
    let dumpFee = dump ? 250 : 0;
    let distance = 0;

    if (needDropOff || needPickup) {
      if (!zipcode) {
        result.innerHTML = '<span class="text-red-600">Please enter your zip code for delivery estimate.</span>';
        return;
      }
      // Call Nominatim API for Keller TX to user zip
      try {
        const keller = 'Keller, TX';
        const [kellerRes, userRes] = await Promise.all([
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(keller)}`),
          fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(zipcode + ', TX')}`)
        ]);
        const kellerData = await kellerRes.json();
        const userData = await userRes.json();
        if (!kellerData[0] || !userData[0]) throw new Error('Invalid location');
        const lat1 = parseFloat(kellerData[0].lat);
        const lon1 = parseFloat(kellerData[0].lon);
        const lat2 = parseFloat(userData[0].lat);
        const lon2 = parseFloat(userData[0].lon);
        // Haversine formula
        const R = 3958.8; // miles
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        distance = R * c;
        if (distance <= 20) {
          // Flat rate within 20 miles
          dropOffCost = needDropOff ? 75 : 0;
          pickupCost = needPickup ? 75 : 0;
        } else {
          // Beyond 20 miles: $3.5 per mile for each service
          dropOffCost = needDropOff ? distance * 3.5 : 0;
          pickupCost = needPickup ? distance * 3.5 : 0;
        }
      } catch (err) {
        result.innerHTML = '<span class="text-red-600">Could not estimate delivery distance. Please check your zip code.</span>';
        return;
      }
    }

    const deliveryCost = dropOffCost + pickupCost;
    const total = rentalCost + deliveryCost + dumpFee;
    result.innerHTML = `
      <div class="bg-faded-cream p-4 rounded-lg mt-4">
        <div class="font-bold text-lg mb-2">Estimated Total: <span class="text-rustic-red">$${total.toFixed(2)}</span></div>
        <ul class="text-charcoal/90 text-sm mb-2">
          <li>Rental: $${rentalCost.toFixed(2)} (${days} day${days > 1 ? 's' : ''} @ $${dailyRate}/day)</li>
          <li>Drop Off: $${dropOffCost.toFixed(2)} ${needDropOff ? `(${distance.toFixed(1)} mi @ $3.5/mi)` : '(self pickup)'}</li>
          <li>Pickup: $${pickupCost.toFixed(2)} ${needPickup ? `(${distance.toFixed(1)} mi @ $3.5/mi)` : '(self return)'}</li>
          <li>Dump Fee: $${dumpFee.toFixed(2)} (${dump ? 'We dump for you' : 'You dump yourself'})</li>
        </ul>
        <div class="text-xs text-charcoal/60">* This is an estimate. Final price may vary based on actual address and availability.</div>
      </div>
    `;
  });
}
