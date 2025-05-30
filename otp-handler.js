/**
 * OTP Handler for Parcel Tracking System
 * This file contains functions for OTP verification and handling
 */

// Function to handle status change and show/hide OTP section
function showOTPSectionIfDelivered() {
    console.log('Checking if status is Delivered to show OTP section');
    // Check both handler dashboard and tracking page select elements
    const statusSelect = document.getElementById('newStatus') || document.getElementById('status-select');
    const otpSection = document.getElementById('otpVerificationSection');
    
    if (statusSelect && otpSection) {
        console.log('Current status:', statusSelect.value);
        
        if (statusSelect.value === 'Delivered') {
            console.log('Status is Delivered - showing OTP section');
            
            // Make OTP section visible with multiple approaches to ensure it works
            otpSection.style.cssText = "display: block !important; border: 2px solid #4CAF50; padding: 15px; margin-top: 15px; border-radius: 5px; background-color: #f7f7f7; box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);";
            otpSection.style.display = 'block';
            
            // Remove any inline style that might be hiding the element
            otpSection.removeAttribute('hidden');
            
            // Apply animation by resetting and adding the class
            otpSection.classList.remove('animated');
            void otpSection.offsetWidth; // Trigger reflow to restart animation
            otpSection.classList.add('animated');
            
            // Reset any previous error messages
            const otpError = document.getElementById('otpError');
            if (otpError) {
                otpError.style.display = 'none';
            }
            
            // Focus on the OTP input
            const otpInput = document.getElementById('otpInput');
            if (otpInput) {
                setTimeout(() => otpInput.focus(), 300);
            }
            
            // Log the visibility state for debugging
            console.log('OTP section display status after showing:', 
                otpSection.style.display,
                'Computed style:', 
                window.getComputedStyle(otpSection).display);
                
            return true; // Indicate that OTP section was shown
        } else {
            console.log('Status is not Delivered - hiding OTP section');
            otpSection.style.display = 'none';
            return false; // Indicate that OTP section was hidden
        }
    } else {
        console.error('Could not find status select or OTP section elements');
        return false;
    }
}

// Setup the direct click handler for delivered option (handler dashboard specific)
function setupDirectDeliveryClick() {
    // Works only for handler dashboard
    const deliveredOption = document.querySelector('#newStatus option[value="Delivered"]');
    const statusSelect = document.getElementById('newStatus');
    
    if (deliveredOption && statusSelect) {
        console.log('Setting up direct click for Delivered option');
        
        // Add a click event to the option itself
        deliveredOption.addEventListener('click', function() {
            console.log('Delivered option clicked directly');
            
            // Set the select value
            statusSelect.value = 'Delivered';
            
            // Show OTP section
            showOTPSectionIfDelivered();
            
            // Also trigger any change events manually
            const event = new Event('change');
            statusSelect.dispatchEvent(event);
        });
    }
}

// Function to directly mark as delivered and show OTP
function markAsDelivered() {
    // Works with both handler dashboard and tracking page
    const statusSelect = document.getElementById('newStatus') || document.getElementById('status-select');
    if (statusSelect) {
        console.log('Marking status as Delivered via direct button');
        
        // Set the value to Delivered
        statusSelect.value = 'Delivered';
        
        // Show OTP section
        showOTPSectionIfDelivered();
        
        // Also trigger any change events manually
        const event = new Event('change');
        statusSelect.dispatchEvent(event);
        
        // Double check after a short delay that OTP section is actually visible
        setTimeout(() => {
            const otpSection = document.getElementById('otpVerificationSection');
            if (otpSection && (otpSection.style.display === 'none' || otpSection.style.display === '')) {
                console.log('OTP section still not visible after delay, forcing display');
                otpSection.style.cssText = "display: block !important;";
                
                // Also try with jQuery if available
                if (window.jQuery) {
                    try {
                        jQuery('#otpVerificationSection').show();
                    } catch (e) {
                        console.error('Error using jQuery to show OTP section:', e);
                    }
                }
            }
            
            // Focus on OTP input field
            const otpInput = document.getElementById('otpInput');
            if (otpInput) {
                otpInput.focus();
            }
        }, 500);
        
        return true;
    }
    return false;
}

// Function to check if the page has OTP verification elements
function hasOtpElements() {
    const statusSelect = document.getElementById('newStatus') || document.getElementById('status-select');
    const otpSection = document.getElementById('otpVerificationSection');
    return !!statusSelect && !!otpSection;
}

// Function to force show OTP section
function forceShowOTPSection() {
    const otpSection = document.getElementById('otpVerificationSection');
    if (otpSection) {
        console.log('Forcing OTP section visibility');
        otpSection.style.cssText = "display: block !important; border: 2px solid #4CAF50; padding: 15px; margin-top: 15px; border-radius: 5px; background-color: #f7f7f7; box-shadow: 0 0 10px rgba(76, 175, 80, 0.5);";
        otpSection.style.display = 'block';
        otpSection.removeAttribute('hidden');
        
        // Focus on OTP input field
        const otpInput = document.getElementById('otpInput');
        if (otpInput) {
            setTimeout(() => otpInput.focus(), 100);
        }
        
        return true;
    }
    return false;
}

// Export functions for use in other files
if (typeof window !== 'undefined') {
    window.showOTPSectionIfDelivered = showOTPSectionIfDelivered;
    window.setupDirectDeliveryClick = setupDirectDeliveryClick;
    window.markAsDelivered = markAsDelivered;
    window.hasOtpElements = hasOtpElements;
    window.forceShowOTPSection = forceShowOTPSection;
    
    // Auto-initialize when the document is loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('OTP handler initializing...');
        
        // Check if this page has OTP elements
        if (hasOtpElements()) {
            console.log('OTP elements found on page');
            
            // Set up direct click handlers (for handler dashboard)
            setupDirectDeliveryClick();
            
            // Check if we need to show OTP section on load
            setTimeout(showOTPSectionIfDelivered, 300);
            
            // Add a mutation observer to monitor for DOM changes that might affect the status select
            try {
                const statusSelect = document.getElementById('newStatus') || document.getElementById('status-select');
                
                if (statusSelect) {
                    const statusSelectObserver = new MutationObserver(function(mutations) {
                        mutations.forEach(function(mutation) {
                            setTimeout(showOTPSectionIfDelivered, 100);
                        });
                    });
                    
                    statusSelectObserver.observe(statusSelect, { 
                        attributes: true, 
                        childList: true 
                    });
                    
                    // Also add change event listener
                    statusSelect.addEventListener('change', function() {
                        console.log('Status changed to:', this.value);
                        setTimeout(showOTPSectionIfDelivered, 50);
                    });
                }
                
                // Also observe the form container for visibility changes
                const formContainer = document.getElementById('updateStatusForm') || document.getElementById('status-update-section');
                if (formContainer) {
                    const formObserver = new MutationObserver(function() {
                        if (formContainer.style.display !== 'none') {
                            setTimeout(showOTPSectionIfDelivered, 100);
                        }
                    });
                    
                    formObserver.observe(formContainer, { attributes: true });
                }
                
                // Initial check if status is already set to Delivered
                setTimeout(function() {
                    if ((statusSelect && statusSelect.value === 'Delivered')) {
                        console.log('Status is already Delivered on load, forcing OTP section visibility');
                        forceShowOTPSection();
                    }
                }, 500);
                
            } catch (e) {
                console.error('Error setting up mutation observers:', e);
            }
        } else {
            console.log('No OTP elements found on page, skipping initialization');
        }
        
        console.log('OTP handler initialization complete');
    });
}
