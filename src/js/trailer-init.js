import { initBackToTop } from '/src/js/components/back-to-top.js';
import { initDeliveryOption } from '/src/js/components/delivery-option.js';
import { initDatePicker } from '/src/js/components/date-picker.js';
import { handleInquiryForm } from '/src/js/utils/api/form-handler.js';

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
    initBackToTop();
    initDeliveryOption();
    handleInquiryForm();
    await waitForFlatpickr();
    initDatePicker();
});
