import { inquirySchema } from "./schemas.js";

// Support both the newer inquiry form and older quote-form (backwards compatible)
const form = document.getElementById("inquiryForm") || document.getElementById("quote-form");
const successMsg = document.getElementById("successMessage") || document.getElementById("success-msg");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // 1. Reset UI (Clear previous errors and styling)
        document.querySelectorAll(".form-error, .error-msg").forEach(el => {
            el.style.display = "none";
            el.classList.remove('show');
            el.innerText = "";
        });
        document.querySelectorAll("input, textarea, select").forEach(el => el.classList.remove("input-error"));
        document.querySelectorAll(".form-group").forEach(g => g.classList.remove('error'));

        // 2. Capture Raw Data
        const formData = new FormData(form);
        const rawData = Object.fromEntries(formData.entries());

        // 3. Validate & Sanitize using Zod (inquirySchema)
        const result = inquirySchema.safeParse(rawData);

        if (!result.success) {
            // --- FAILURE: Show Errors ---
            const errors = result.error.format();

            Object.keys(errors).forEach((key) => {
                if (key !== "_errors") {
                    // Support old error element naming (error-<field>) and new (<field>Error)
                    const errorElement = document.getElementById(`${key}Error`) || document.getElementById(`error-${key}`);
                    const inputElement = document.getElementById(key) || form.querySelector(`[name="${key}"]`);
                    const message = errors[key]._errors && errors[key]._errors[0] ? errors[key]._errors[0] : (errors[key]._errors || []).join(', ');

                    // Display the error message
                    if (errorElement) {
                        errorElement.innerText = message || 'Invalid input';
                        errorElement.style.display = "block";
                        errorElement.classList.add('show');
                    }
                    // Add error class to the input field and form-group
                    if (inputElement) {
                        inputElement.classList.add("input-error");
                        inputElement.closest('.form-group')?.classList.add('error');
                    }
                }
            });

            // Scroll to first error
            const firstError = form.querySelector('.form-group.error');
            if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            // --- SUCCESS: Submit Sanitized Data (send to API) ---
            console.log("Form is valid. Sanitized Data:", result.data);

            const btn = form.querySelector("button[type=submit]") || form.querySelector("button");
            const originalText = btn ? btn.innerText : null;
            if (btn) {
                btn.innerText = "Sending...";
                btn.disabled = true;
            }

            try {
                const resp = await fetch('/api/submit-quote', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(result.data)
                });

                const payload = await resp.json().catch(() => ({}));

                if (resp.ok && payload && payload.success) {
                    // show success text requested by user
                    if (successMsg) {
                        successMsg.textContent = 'inquiery send!';
                        successMsg.classList.add('show');
                        successMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        alert('inquiery send!');
                    }

                    form.reset();
                } else {
                    // handle validation errors returned from server
                    if (payload && payload.errors && typeof payload.errors === 'object') {
                        Object.keys(payload.errors).forEach(fieldName => {
                            const errEl = document.getElementById(`${fieldName}Error`);
                            const inputEl = document.getElementById(fieldName) || form.querySelector(`[name="${fieldName}"]`);
                            if (errEl) {
                                errEl.textContent = payload.errors[fieldName];
                                errEl.classList.add('show');
                                errEl.style.display = 'block';
                            }
                            if (inputEl) {
                                inputEl.classList.add('input-error');
                                inputEl.closest('.form-group')?.classList.add('error');
                            }
                        });

                        const firstError = form.querySelector('.form-group.error');
                        if (firstError) firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    } else {
                        alert('Submission failed. Please try again later.');
                    }
                }
            } catch (err) {
                console.error('Network error sending inquiry:', err);
                alert('Network error. Please try again later.');
            } finally {
                if (btn && originalText !== null) {
                    btn.innerText = originalText;
                    btn.disabled = false;
                }

                // Auto-hide success message if present
                if (successMsg) {
                    setTimeout(() => { successMsg.classList.remove('show'); }, 5000);
                }
            }
        }
    });
}