import { inquirySchema, validateFormData } from './schemas.js';

export function handleInquiryForm() {
  const form = document.getElementById('inquiryForm');
  if (!form) return;

  const successMessage = document.getElementById('successMessage');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Clear previous errors
    form.querySelectorAll('.form-error').forEach(error => {
      error.textContent = '';
      error.classList.remove('show');
    });
    form.querySelectorAll('.form-group.error').forEach(group => {
      group.classList.remove('error');
    });
    if (successMessage) successMessage.style.display = 'none';

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Client-side validation
    const result = validateFormData(inquirySchema, data);

    if (result.success) {
      try {
        const response = await fetch('/api/submit-quote', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result.data),
        });

        const responseData = await response.json();

        if (response.ok && responseData.success) {
          if (successMessage) {
            successMessage.style.display = 'block';
          }
          form.reset();
          // Reset date picker minimums
          const now = new Date();
          now.setSeconds(0, 0);
          const minDateTime = toLocalDateTimeInputValue(now);
          const pickupDateInput = document.getElementById('pickupDate');
          const deliveryDateInput = document.getElementById('deliveryDate');
          if(pickupDateInput) pickupDateInput.min = minDateTime;
          if(deliveryDateInput) deliveryDateInput.min = minDateTime;

        } else {
          // Handle server-side validation errors
          if (responseData.errors) {
            Object.entries(responseData.errors).forEach(([field, message]) => {
              const errorEl = document.getElementById(`${field}Error`);
              const group = document.getElementById(field)?.closest('.form-group');
              if (errorEl) {
                errorEl.textContent = message;
                errorEl.classList.add('show');
              }
              if (group) {
                group.classList.add('error');
              }
            });
          } else {
            alert('An unexpected error occurred on the server.');
          }
        }
      } catch (error) {
        console.error('Submission error:', error);
        alert('An error occurred while submitting the form.');
      }
    } else {
      // Display Zod validation errors
      Object.entries(result.errors).forEach(([field, message]) => {
        const errorEl = document.getElementById(`${field}Error`);
        const group = document.getElementById(field)?.closest('.form-group');
        if (errorEl) {
          errorEl.textContent = message;
          errorEl.classList.add('show');
        }
        if (group) {
          group.classList.add('error');
        }
      });
    }
  });

  // --- Date Picker Logic ---
  function toLocalDateTimeInputValue(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const now = new Date();
  now.setSeconds(0, 0);
  const minDateTime = toLocalDateTimeInputValue(now);

  const pickupDateInput = document.getElementById('pickupDate');
  const deliveryDateInput = document.getElementById('deliveryDate');
  if (pickupDateInput) pickupDateInput.min = minDateTime;
  if (deliveryDateInput) deliveryDateInput.min = minDateTime;

  function isDateTimeLocalFormat(v) {
    return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(v);
  }

  function clearError(fieldName) {
    const errEl = document.getElementById(`${fieldName}Error`);
    const group = document.getElementById(fieldName)?.closest('.form-group');
    if (errEl) {
      errEl.textContent = '';
      errEl.classList.remove('show');
    }
    if (group) {
      group.classList.remove('error');
    }
  }

  if (pickupDateInput) {
    pickupDateInput.addEventListener('change', () => {
      clearError('pickupDate');
      if (!pickupDateInput.value || !isDateTimeLocalFormat(pickupDateInput.value)) return;

      if (pickupDateInput.value < minDateTime) {
        pickupDateInput.value = minDateTime;
      }

      if (deliveryDateInput) {
        deliveryDateInput.min = pickupDateInput.value;
        if (deliveryDateInput.value && deliveryDateInput.value < pickupDateInput.value) {
          deliveryDateInput.value = pickupDateInput.value;
        }
      }
    });
  }

  if (deliveryDateInput) {
    deliveryDateInput.addEventListener('change', () => {
      clearError('deliveryDate');
      if (!deliveryDateInput.value || !isDateTimeLocalFormat(deliveryDateInput.value)) return;

      if (deliveryDateInput.value < (pickupDateInput.value || minDateTime)) {
        deliveryDateInput.value = pickupDateInput.value || minDateTime;
      }
    });
  }

  // Clear error on input
  form.querySelectorAll('input, select, textarea').forEach(field => {
    field.addEventListener('input', () => {
      clearError(field.name);
    });
  });
}