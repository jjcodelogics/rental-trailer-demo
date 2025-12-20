/**
 * Date Picker Component
 * Initializes Flatpickr date range picker for rental booking
 * 
 * @module components/date-picker
 * @requires flatpickr - External date picker library
 */

/**
 * Initializes the Flatpickr date range picker
 * Configures pickup and delivery date selection with validation
 * 
 * @function initDatePicker
 * @returns {void}
 * @example
 * // Initialize after Flatpickr library is loaded
 * initDatePicker();
 */
export function initDatePicker() {
  const dateRangeEl = document.getElementById('dateRange');
  
  // Ensure element exists and Flatpickr is available
  if (!dateRangeEl || typeof flatpickr === 'undefined') return;
  
  flatpickr('#dateRange', {
    mode: 'range',
    minDate: 'today',
    dateFormat: 'Y-m-d',
    
    /**
     * Handle date range change
     * @param {Date[]} selectedDates - Array of selected dates
     */
    onChange: function(selectedDates, dateStr, instance) {
      if (selectedDates.length === 2) {
        // Populate hidden inputs with ISO date strings
        document.getElementById('pickupDate').value = selectedDates[0].toISOString();
        document.getElementById('deliveryDate').value = selectedDates[1].toISOString();
        
        // Clear validation error if present
        const errorEl = document.getElementById('dateRangeError');
        if (errorEl) errorEl.textContent = '';
      }
    },
    
    /**
     * Validate on picker close
     * @param {Date[]} selectedDates - Array of selected dates
     */
    onClose: function(selectedDates, dateStr, instance) {
      // Ensure both dates are selected
      if (selectedDates.length < 2) {
        const errorEl = document.getElementById('dateRangeError');
        if (errorEl) {
          errorEl.textContent = 'Please select both pickup and drop-off dates';
        }
      }
    }
  });
}
