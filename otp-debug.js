/**
 * OTP Debug Tool for Parcel Tracking System
 * This file contains functions to help debug OTP verification issues
 */

// Function to check why OTP section isn't showing
function debugOtpVisibility() {
    console.log('=== OTP VISIBILITY DEBUGGING ===');
    
    // Check for status select
    const statusSelect = document.getElementById('status-select') || document.getElementById('newStatus');
    console.log('Status Select found:', !!statusSelect);
    if (statusSelect) {
        console.log('Current status value:', statusSelect.value);
    }
    
    // Check for OTP section
    const otpSection = document.getElementById('otpVerificationSection');
    console.log('OTP Section found:', !!otpSection);
    if (otpSection) {
        console.log('OTP Section display style:', otpSection.style.display);
        console.log('OTP Section computed style:', window.getComputedStyle(otpSection).display);
        console.log('OTP Section visibility:', window.getComputedStyle(otpSection).visibility);
        console.log('OTP Section opacity:', window.getComputedStyle(otpSection).opacity);
        console.log('OTP Section HTML:', otpSection.outerHTML);
    }
    
    // Check for OTP input
    const otpInput = document.getElementById('otpInput');
    console.log('OTP Input found:', !!otpInput);
    
    // Try to force OTP section visibility
    if (otpSection) {
        console.log('Attempting to force OTP section visibility...');
        otpSection.style.cssText = "display: block !important; border: 2px solid red !important;";
        otpSection.style.display = 'block';
        otpSection.removeAttribute('hidden');
        
        // Add a visual marker
        otpSection.style.border = '3px solid red';
        otpSection.style.backgroundColor = '#fff3cd';
        
        console.log('OTP Section display after force:', otpSection.style.display);
        
        // Focus on input if found
        if (otpInput) {
            otpInput.focus();
            otpInput.placeholder = "ENTER OTP HERE - DEBUG MODE";
        }
    }
    
    console.log('=== END DEBUGGING ===');
    return "Debug complete - see console for details";
}

// Add debug button to the page
function addOtpDebugButton() {
    console.log('Adding OTP debug button...');
    
    const debugBtn = document.createElement('button');
    debugBtn.textContent = '🔍 Debug OTP';
    debugBtn.style.position = 'fixed';
    debugBtn.style.bottom = '10px';
    debugBtn.style.right = '10px';
    debugBtn.style.zIndex = '9999';
    debugBtn.style.padding = '10px';
    debugBtn.style.backgroundColor = '#ff9800';
    debugBtn.style.color = 'white';
    debugBtn.style.border = 'none';
    debugBtn.style.borderRadius = '4px';
    debugBtn.style.cursor = 'pointer';
    
    debugBtn.addEventListener('click', debugOtpVisibility);
    
    document.body.appendChild(debugBtn);
    console.log('Debug button added');
}

// Auto-initialize when document is loaded
if (typeof window !== 'undefined') {
    window.debugOtpVisibility = debugOtpVisibility;
    window.addOtpDebugButton = addOtpDebugButton;
    
    document.addEventListener('DOMContentLoaded', addOtpDebugButton);
}

// Force OTP section visibility after a delay
setTimeout(() => {
    console.log('Delayed OTP visibility check running...');
    const statusSelect = document.getElementById('status-select') || document.getElementById('newStatus');
    if (statusSelect && statusSelect.value === 'Delivered') {
        console.log('Status is Delivered, forcing OTP section visibility...');
        debugOtpVisibility();
    }
}, 2000);
