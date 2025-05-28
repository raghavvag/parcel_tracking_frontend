/**
 * Tracking functionality for parcel tracking system
 */

// Function to track a shipment by tracking ID
async function trackShipment(trackingId) {
    try {
        // Check if tracking ID is empty or undefined
        if (!trackingId) {
            return {
                success: false,
                error: 'No tracking ID provided'
            };
        }
          // Clean up tracking ID if it comes from a direct URL (like /track/PT-2505-OKX4G0)
        let cleanTrackingId = trackingId;
        
        // Handle patterns like "track/PT-2505-OKX4G0" or "/PT-2505-OKX4G0"
        if (cleanTrackingId.includes('/')) {
            // Handle backend API URL pattern: https://localhost:5001/api/shipment/tracking/PT-2505-9B9TB5
            if (cleanTrackingId.toLowerCase().includes('/api/shipment/tracking/')) {
                cleanTrackingId = cleanTrackingId.split('/api/shipment/tracking/').pop();
                console.log('Extracted tracking ID from backend API URL:', cleanTrackingId);
            } 
            // Standard path extraction for other formats
            else {
                cleanTrackingId = cleanTrackingId.split('/').pop();
            }
        }
        
        console.log('Processing tracking ID:', cleanTrackingId);
        
        // Check if we have this shipment cached in sessionStorage
        const cachedShipment = sessionStorage.getItem('lastTrackedShipment');
        if (cachedShipment) {
            const shipment = JSON.parse(cachedShipment);
            // If this is the same tracking ID we just looked up, use the cached data
            if (shipment.trackingId === cleanTrackingId || shipment.id === cleanTrackingId) {
                console.log('Using cached shipment data:', shipment);
                return {
                    success: true,
                    shipment: shipment,
                    cached: true
                };
            }
        }        console.log('Fetching shipment with tracking ID:', cleanTrackingId);
        
        // Determine if we're running on GitHub Pages or locally
        const isGitHubPages = window.location.hostname === "raghavvag.github.io";
        const apiBaseUrl = isGitHubPages 
            ? "https://your-deployed-backend-url.com" // Replace with your actual deployed backend URL
            : "https://localhost:5001";
        
        // Always use the tracking endpoint for tracking IDs
        const response = await fetch(`${apiBaseUrl}/api/Shipment/tracking/${cleanTrackingId}`);
        
        // Log full URL for debugging
        console.log(`Making API request to: https://localhost:5001/api/Shipment/tracking/${cleanTrackingId}`);
        
        // Log response status for debugging
        console.log('API response status:', response.status);
        
        if (response.status === 404) {
            return {
                success: false,
                error: 'No shipment found with this tracking number'
            };
        }
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const shipment = await response.json();
        console.log('Shipment data received from API:', shipment);
        
        // Check if we got valid data
        if (!shipment || (typeof shipment === 'object' && Object.keys(shipment).length === 0)) {
            throw new Error('Empty response received from server');
        }
          // Map the data to our frontend format
        const mappedShipment = typeof mapShipmentData === 'function'
            ? mapShipmentData(shipment)
            : shipment;
            
        // Cache the result for potential reuse
        sessionStorage.setItem('lastTrackedShipment', JSON.stringify(mappedShipment));
        
        return {
            success: true,
            shipment: mappedShipment
        };
    } catch (error) {
        console.error('Error tracking shipment:', error);
        return {
            success: false,
            error: 'Error connecting to the server. Please try again later.'
        };
    }
}

// Function to display tracking info on the tracking page
function displayTrackingInfo(shipment) {
    // Ensure data is properly mapped
    const data = typeof mapShipmentData === 'function' 
        ? mapShipmentData(shipment) 
        : shipment;
    
    // Display the tracking ID prominently
    document.getElementById('tracking-id').textContent = data.trackingId || data.id;
    
    // Display shipment status with appropriate styling
    const statusElement = document.getElementById('shipment-status');
    statusElement.textContent = data.status || 'Pending';
    
    // Add color coding for status
    statusElement.className = getStatusClass(data.status);
    
    // Display other shipment details
    document.getElementById('package-type').textContent = data.packageType || 'Standard Package';
    document.getElementById('package-weight').textContent = data.weight ? `${data.weight} kg` : 'N/A';
    document.getElementById('recipient-name').textContent = data.recipientName || 'N/A';
    document.getElementById('delivery-address').textContent = data.deliveryAddress || 'N/A';
    document.getElementById('special-instructions').textContent = data.specialInstructions || 'None';
    
    // Display current location if available
    const currentAddressElement = document.getElementById('current-address');
    if (currentAddressElement) {
        currentAddressElement.textContent = data.currentAddress || 'Information not available';
    }
    
    // Show current location section if we have a current address
    const currentLocationSection = document.getElementById('current-location-section');
    if (currentLocationSection) {
        if (data.currentAddress && data.currentAddress !== 'N/A' && data.currentAddress !== 'In Transit') {
            currentLocationSection.style.display = 'block';
        } else {
            currentLocationSection.style.display = 'none';
        }
    }
    
    // Format the date nicely
    const createdDate = data.createdAt ? new Date(data.createdAt).toLocaleString() : 'N/A';
    document.getElementById('created-date').textContent = createdDate;
    
    // Update title with tracking ID for better user experience
    document.title = `Tracking: ${data.trackingId || data.id} | Parcel Tracking System`;
}

// Helper function to get CSS class based on shipment status
function getStatusClass(status) {
    if (!status) return 'status-pending';
    
    // Convert to lowercase for case-insensitive matching
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('delivered')) {
        return 'status-delivered';
    } else if (statusLower.includes('transit')) {
        return 'status-transit';
    } else if (statusLower.includes('out for delivery')) {
        return 'status-out-for-delivery';
    } else if (statusLower.includes('processing')) {
        return 'status-processing';
    } else if (statusLower.includes('returned')) {
        return 'status-returned';
    } else if (statusLower.includes('cancelled') || statusLower.includes('canceled')) {
        return 'status-cancelled';
    } else {
        return 'status-pending';
    }
}

// Helper function to get description for a status
function getStatusDescription(status) {
    if (!status) return 'Status information not available.';
    
    // Convert to lowercase for case-insensitive matching
    const statusLower = status.toLowerCase();
    
    // Map of status descriptions (lowercase keys for case-insensitive matching)
    const descriptions = {
        'pending': 'Your shipment has been created and is awaiting processing.',
        'processing': 'We are preparing your shipment for delivery.',
        'in transit': 'Your shipment is on its way to the destination.',
        'out for delivery': 'Your shipment will be delivered today.',
        'delivered': 'Your shipment has been successfully delivered.',
        'returned': 'The shipment has been returned to the sender.',
        'cancelled': 'The shipment has been cancelled.'
    };
    
    return descriptions[statusLower] || `Status: ${status}`;
}
