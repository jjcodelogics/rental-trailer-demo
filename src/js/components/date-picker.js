export function initDatePicker() {
  const dateRangeEl = document.getElementById('dateRange');
  
  if (!dateRangeEl || typeof flatpickr === 'undefined') return;
  
  flatpickr('#dateRange', {
    mode: 'range',
    minDate: 'today',
    dateFormat: 'Y-m-d',
    
    onChange: function(selectedDates, dateStr, instance) {
      if (selectedDates.length === 2) {
        document.getElementById('pickupDate').value = selectedDates[0].toISOString();
        document.getElementById('deliveryDate').value = selectedDates[1].toISOString();
        
        const errorEl = document.getElementById('dateRangeError');
        if (errorEl) errorEl.textContent = '';
      }
    },
    
    onClose: function(selectedDates, dateStr, instance) {
      if (selectedDates.length < 2) {
        const errorEl = document.getElementById('dateRangeError');
        if (errorEl) {
          errorEl.textContent = 'Please select both pickup and drop-off dates';
        }
      }
    }
  });
}
