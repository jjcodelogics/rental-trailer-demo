/**
 * Trailer Page Initialization
 * Handles initialization of all trailer page components
 */
import { initMobileMenu } from '/src/js/components/mobile-menu.js';
import { initBackToTop } from '/src/js/components/back-to-top.js';
import { initDeliveryOption } from '/src/js/components/delivery-option.js';
import { initDatePicker } from '/src/js/components/date-picker.js';
import { handleInquiryForm } from '/src/js/utils/api/form-handler.js';

/**
 * Function to wait for flatpickr to be available
 * @returns {Promise<void>}
 */
function waitForFlatpickr() {
    return new Promise((resolve) => {
        if (typeof flatpickr !== 'undefined') {
            resolve();
        } else {
            const checkInterval = setInterval(() => {
                if (typeof flatpickr !== 'undefined') {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 50);
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // initMobileMenu(); // Already initialized in main.js
    initBackToTop();
    initDeliveryOption();
    handleInquiryForm();
    // Wait for flatpickr to load before initializing
    await waitForFlatpickr();
    initDatePicker();
});
