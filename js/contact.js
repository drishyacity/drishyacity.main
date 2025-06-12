/**
 * DrishyaCity Portfolio - Contact Form JavaScript
 * Handles contact form submission with EmailJS integration
 */

(function() {
    'use strict';

    // EmailJS Configuration
    const EMAILJS_SERVICE_ID = 'service_drishyacity'; // You'll need to configure this
    const EMAILJS_TEMPLATE_ID = 'template_drishyacity'; // You'll need to configure this
    const EMAILJS_PUBLIC_KEY = 'your_emailjs_public_key'; // You'll need to configure this

    // DOM Elements
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const formMessage = document.getElementById('form-message');
    const formInputs = contactForm ? contactForm.querySelectorAll('input, select, textarea') : [];

    // Form state
    let isSubmitting = false;

    // Initialize Contact Form
    function init() {
        if (!contactForm) return;
        
        setupEmailJS();
        setupFormHandlers();
        setupFormValidation();
        setupFormEnhancements();
    }

    // Setup EmailJS
    function setupEmailJS() {
        // Initialize EmailJS
        if (typeof emailjs !== 'undefined') {
            emailjs.init(EMAILJS_PUBLIC_KEY);
        } else {
            // Load EmailJS dynamically
            loadEmailJS().then(() => {
                emailjs.init(EMAILJS_PUBLIC_KEY);
            }).catch(error => {
                console.error('Failed to load EmailJS:', error);
                showFormMessage('Service temporarily unavailable. Please try again later.', 'error');
            });
        }
    }

    function loadEmailJS() {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Setup Form Handlers
    function setupFormHandlers() {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Real-time validation
        formInputs.forEach(input => {
            input.addEventListener('blur', () => validateInput(input));
            input.addEventListener('input', () => {
                clearInputError(input);
                updateSubmitButton();
            });
        });
    }

    // Handle Form Submission
    async function handleFormSubmit(e) {
        e.preventDefault();
        
        if (isSubmitting) return;
        
        // Validate all fields
        const isValid = validateForm();
        if (!isValid) {
            showFormMessage('Please correct the errors above.', 'error');
            return;
        }
        
        // Prepare form data
        const formData = getFormData();
        
        try {
            setSubmittingState(true);
            await sendEmail(formData);
            handleSubmissionSuccess();
        } catch (error) {
            handleSubmissionError(error);
        } finally {
            setSubmittingState(false);
        }
    }

    // Send Email via EmailJS
    function sendEmail(formData) {
        // Fallback if EmailJS is not available
        if (typeof emailjs === 'undefined') {
            return sendEmailFallback(formData);
        }

        const templateParams = {
            from_name: `${formData.firstName} ${formData.lastName}`,
            from_email: formData.email,
            company: formData.company || 'Not specified',
            project_type: formData.projectType || 'Not specified',
            budget: formData.budget || 'Not specified',
            timeline: formData.timeline || 'Not specified',
            message: formData.message,
            to_email: 'drishyacity@gmail.com'
        };

        return emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
    }

    // Fallback email sending method
    function sendEmailFallback(formData) {
        // Use FormSubmit as fallback
        const formSubmitData = new FormData();
        
        formSubmitData.append('name', `${formData.firstName} ${formData.lastName}`);
        formSubmitData.append('email', formData.email);
        formSubmitData.append('company', formData.company);
        formSubmitData.append('project_type', formData.projectType);
        formSubmitData.append('budget', formData.budget);
        formSubmitData.append('timeline', formData.timeline);
        formSubmitData.append('message', formData.message);
        formSubmitData.append('_subject', 'New Contact Form Submission - DrishyaCity');
        formSubmitData.append('_next', window.location.href + '?submitted=true');
        formSubmitData.append('_captcha', 'false');

        return fetch('https://formsubmit.co/drishyacity@gmail.com', {
            method: 'POST',
            body: formSubmitData
        });
    }

    // Get Form Data
    function getFormData() {
        const formData = new FormData(contactForm);
        const data = {};
        
        for (let [key, value] of formData.entries()) {
            data[key] = value.trim();
        }
        
        return data;
    }

    // Form Validation
    function validateForm() {
        let isValid = true;
        
        formInputs.forEach(input => {
            if (!validateInput(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateInput(input) {
        const value = input.value.trim();
        const inputType = input.type;
        const isRequired = input.hasAttribute('required');
        let isValid = true;
        let errorMessage = '';

        // Clear previous error
        clearInputError(input);

        // Required field validation
        if (isRequired && !value) {
            isValid = false;
            errorMessage = 'This field is required.';
        }
        // Email validation
        else if (inputType === 'email' && value && !isValidEmail(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
        // Name validation
        else if (input.name === 'firstName' || input.name === 'lastName') {
            if (value && value.length < 2) {
                isValid = false;
                errorMessage = 'Name must be at least 2 characters long.';
            }
        }
        // Message validation
        else if (input.name === 'message' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters long.';
        }

        if (!isValid) {
            showInputError(input, errorMessage);
        }

        return isValid;
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function showInputError(input, message) {
        input.classList.add('error');
        
        let errorElement = input.parentNode.querySelector('.input-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'input-error';
            input.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
    }

    function clearInputError(input) {
        input.classList.remove('error');
        const errorElement = input.parentNode.querySelector('.input-error');
        if (errorElement) {
            errorElement.remove();
        }
    }

    // Form State Management
    function setSubmittingState(submitting) {
        isSubmitting = submitting;
        
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        if (submitting) {
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');
            btnText.style.display = 'none';
            btnLoading.style.display = 'flex';
            formInputs.forEach(input => input.disabled = true);
        } else {
            submitBtn.disabled = false;
            submitBtn.classList.remove('loading');
            btnText.style.display = 'inline';
            btnLoading.style.display = 'none';
            formInputs.forEach(input => input.disabled = false);
        }
    }

    function updateSubmitButton() {
        const isFormValid = Array.from(formInputs).every(input => {
            if (input.hasAttribute('required')) {
                return input.value.trim() !== '';
            }
            return true;
        });
        
        submitBtn.disabled = !isFormValid || isSubmitting;
        submitBtn.classList.toggle('ready', isFormValid);
    }

    // Success/Error Handlers
    function handleSubmissionSuccess() {
        showFormMessage(
            'Thank you for your message! I\'ll get back to you within 24 hours.',
            'success'
        );
        
        // Reset form
        contactForm.reset();
        updateSubmitButton();
        
        // Track success event
        trackFormSubmission('success');
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function handleSubmissionError(error) {
        console.error('Form submission error:', error);
        
        let errorMessage = 'There was an error sending your message. Please try again.';
        
        if (error.text && error.text.includes('rate limit')) {
            errorMessage = 'Too many requests. Please wait a moment and try again.';
        } else if (!navigator.onLine) {
            errorMessage = 'Please check your internet connection and try again.';
        }
        
        showFormMessage(errorMessage, 'error');
        
        // Track error event
        trackFormSubmission('error', error.message);
    }

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // Auto-hide success messages after 10 seconds
        if (type === 'success') {
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 10000);
        }
    }

    // Form Enhancements
    function setupFormEnhancements() {
        // Character counter for message field
        setupCharacterCounter();
        
        // Auto-save form data
        setupAutoSave();
        
        // Form progress indicator
        setupProgressIndicator();
        
        // Check for submission success from URL
        checkSubmissionStatus();
    }

    function setupCharacterCounter() {
        const messageField = contactForm.querySelector('#message');
        if (!messageField) return;
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const length = messageField.value.length;
            const minLength = 10;
            counter.textContent = `${length} characters (minimum ${minLength})`;
            counter.classList.toggle('valid', length >= minLength);
        }
        
        messageField.addEventListener('input', updateCounter);
        updateCounter();
    }

    function setupAutoSave() {
        const AUTOSAVE_KEY = 'drishyacity_contact_form';
        
        // Load saved data
        try {
            const savedData = localStorage.getItem(AUTOSAVE_KEY);
            if (savedData) {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(key => {
                    const input = contactForm.querySelector(`[name="${key}"]`);
                    if (input && input.type !== 'submit') {
                        input.value = data[key];
                    }
                });
            }
        } catch (error) {
            console.error('Error loading saved form data:', error);
        }
        
        // Save data on input
        const saveFormData = debounce(() => {
            try {
                const formData = getFormData();
                localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(formData));
            } catch (error) {
                console.error('Error saving form data:', error);
            }
        }, 1000);
        
        formInputs.forEach(input => {
            input.addEventListener('input', saveFormData);
        });
        
        // Clear saved data on successful submission
        contactForm.addEventListener('submit', () => {
            setTimeout(() => {
                try {
                    localStorage.removeItem(AUTOSAVE_KEY);
                } catch (error) {
                    console.error('Error clearing saved form data:', error);
                }
            }, 2000);
        });
    }

    function setupProgressIndicator() {
        const requiredFields = Array.from(formInputs).filter(input => 
            input.hasAttribute('required')
        );
        
        if (requiredFields.length === 0) return;
        
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress';
        progressBar.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <div class="progress-text">0% Complete</div>
        `;
        
        contactForm.insertBefore(progressBar, contactForm.firstChild);
        
        function updateProgress() {
            const filledFields = requiredFields.filter(field => 
                field.value.trim() !== ''
            ).length;
            
            const progress = Math.round((filledFields / requiredFields.length) * 100);
            
            const progressFill = progressBar.querySelector('.progress-fill');
            const progressText = progressBar.querySelector('.progress-text');
            
            progressFill.style.width = `${progress}%`;
            progressText.textContent = `${progress}% Complete`;
            
            progressBar.classList.toggle('complete', progress === 100);
        }
        
        formInputs.forEach(input => {
            input.addEventListener('input', updateProgress);
        });
        
        updateProgress();
    }

    function checkSubmissionStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('submitted') === 'true') {
            handleSubmissionSuccess();
            
            // Clean up URL
            const url = new URL(window.location);
            url.searchParams.delete('submitted');
            window.history.replaceState({}, '', url);
        }
    }

    // Analytics and Tracking
    function trackFormSubmission(status, error = null) {
        // Analytics tracking would go here
        console.log('Form submission tracked:', status, error);
        
        // Example: Google Analytics
        // if (typeof gtag !== 'undefined') {
        //     gtag('event', 'form_submit', {
        //         'form_name': 'contact_form',
        //         'status': status,
        //         'error': error
        //     });
        // }
    }

    // Utility Functions
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for external use
    window.DrishyaCityContact = {
        validateForm,
        sendEmail: handleFormSubmit,
        showFormMessage
    };

})();

// CSS for contact form enhancements
const contactStyles = document.createElement('style');
contactStyles.textContent = `
    .form-input.error,
    .form-select.error,
    .form-textarea.error {
        border-color: #e53e3e;
        box-shadow: 0 0 0 1px #e53e3e;
    }
    
    .input-error {
        color: #e53e3e;
        font-size: 0.875rem;
        margin-top: 0.25rem;
        font-weight: 500;
    }
    
    .btn.loading {
        opacity: 0.8;
        cursor: not-allowed;
    }
    
    .btn.ready {
        background: linear-gradient(135deg, var(--primary-color), var(--primary-light));
        transform: translateY(-1px);
        box-shadow: var(--shadow-md);
    }
    
    .character-counter {
        font-size: 0.875rem;
        color: var(--text-light);
        margin-top: 0.25rem;
        text-align: right;
    }
    
    .character-counter.valid {
        color: #38a169;
    }
    
    .form-progress {
        margin-bottom: 2rem;
        padding: 1rem;
        background: var(--gray-50);
        border-radius: var(--radius);
    }
    
    .progress-bar {
        height: 8px;
        background: var(--gray-300);
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--primary-color), var(--primary-light));
        transition: width 0.3s ease;
        width: 0%;
    }
    
    .progress-text {
        font-size: 0.875rem;
        color: var(--text-secondary);
        text-align: center;
        font-weight: 500;
    }
    
    .form-progress.complete .progress-text {
        color: var(--primary-color);
    }
    
    .btn-loading {
        display: none;
        align-items: center;
        gap: 0.5rem;
    }
    
    .btn-loading .fa-spinner {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
        .form-progress {
            margin-bottom: 1.5rem;
            padding: 0.75rem;
        }
        
        .character-counter {
            text-align: left;
        }
    }
`;
document.head.appendChild(contactStyles);
