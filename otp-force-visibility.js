// Run this script in the browser console to debug OTP visibility issues
// Copy and paste the entire content to the console then press Enter

(function forceOtpVisibility() {
    console.log('Attempting to force OTP visibility...');
    
    // Find status select and OTP section
    const statusSelect = document.getElementById('status-select') || document.getElementById('newStatus');
    const otpSection = document.getElementById('otpVerificationSection');
    
    console.log('Status select found:', !!statusSelect);
    console.log('OTP section found:', !!otpSection);
    
    if (statusSelect) {
        console.log('Current status:', statusSelect.value);
        
        // If not already set to Delivered, set it now
        if (statusSelect.value !== 'Delivered') {
            console.log('Setting status to Delivered');
            statusSelect.value = 'Delivered';
            
            // Dispatch change event
            const event = new Event('change');
            statusSelect.dispatchEvent(event);
        }
    }
    
    if (otpSection) {
        console.log('OTP section current display:', otpSection.style.display);
        console.log('OTP section computed display:', window.getComputedStyle(otpSection).display);
        
        // Force display with !important
        console.log('Forcing display');
        otpSection.style.cssText = "display: block !important; border: 3px solid red !important;";
        otpSection.style.display = 'block';
        otpSection.removeAttribute('hidden');
        
        // Add a visible marker to confirm it's working
        otpSection.style.backgroundColor = '#ffeb3b50';
        
        console.log('OTP section display now:', otpSection.style.display);
        
        // Focus the OTP input if it exists
        const otpInput = document.getElementById('otpInput');
        if (otpInput) {
            otpInput.value = '';
            otpInput.placeholder = 'ENTER OTP HERE (Debug mode)';
            setTimeout(() => otpInput.focus(), 100);
        }
        
        return "OTP visibility forced - check if it's visible now";
    }
    
    return "Could not find OTP section";
})();
