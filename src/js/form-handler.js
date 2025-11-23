import { QuoteSchema } from "./schemas.js";

const form = document.getElementById("quote-form");
const successMsg = document.getElementById("success-msg");

if (form) {
    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        // 1. Reset UI (Clear previous errors and styling)
        document.querySelectorAll(".error-msg").forEach(el => {
            el.style.display = "none";
            el.innerText = "";
        });
        document.querySelectorAll("input, textarea").forEach(el => el.classList.remove("input-error"));

        // 2. Capture Raw Data
        const formData = new FormData(form);
        const rawData = Object.fromEntries(formData.entries());

        // 3. Validate & Sanitize using Zod
        // safeParse runs the validation and the sanitization (transformations)
        const result = QuoteSchema.safeParse(rawData);

        if (!result.success) {
            // --- FAILURE: Show Errors ---
            const errors = result.error.format();
            
            Object.keys(errors).forEach((key) => {
                if (key !== "_errors") {
                    const errorElement = document.getElementById(`error-${key}`);
                    const inputElement = document.getElementById(key);
                    
                    // Display the error message
                    if (errorElement) {
                        errorElement.innerText = errors[key]._errors[0];
                        errorElement.style.display = "block";
                    }
                    // Add error class to the input field
                    if (inputElement) {
                        inputElement.classList.add("input-error");
                    }
                }
            });
        } else {
            // --- SUCCESS: Submit Sanitized Data ---
            console.log("Form is valid. Sanitized Data:", result.data);
            
            const btn = form.querySelector("button");
            const originalText = btn.innerText;
            btn.innerText = "Sending...";
            btn.disabled = true;

            // In a real application, you would send result.data to your server/API here.
            
            // Simulate Network Request
            setTimeout(() => {
                form.reset();
                btn.innerText = originalText;
                btn.disabled = false;
                successMsg.style.display = "block";
                
                // Auto-hide success message
                setTimeout(() => { successMsg.style.display = "none"; }, 5000);
            }, 1500);
        }
    });
}