/**
 * Data Mapper utility for the tracking system
 * Converts between backend and frontend data formats
 */

// Maps backend data to frontend display format
function mapShipmentData(backendData) {
    // Handle empty or null data
    if (!backendData) {
        return {
            id: 'Unknown',
            trackingId: 'Unknown',
            status: 'Unknown',
            packageType: 'N/A',
            weight: 'N/A',
            recipientName: 'N/A',
            deliveryAddress: 'N/A',
            specialInstructions: 'None',
            createdAt: null
        };
    }        // Map the data based on the screenshot and backend API format
    return {
        // Essential fields
        id: backendData.id || backendData.shipmentId || 'Unknown',
        trackingId: backendData.trackingId || backendData.id || 'Unknown',
        status: backendData.status || 'Pending',
        
        // Shipment details
        packageType: backendData.packageType || backendData.package_type || 'Standard Package',
        weight: backendData.weight ? `${backendData.weight}` : 'N/A',
        
        // Recipient information
        recipientName: backendData.recipientName || backendData.recipient || 'N/A',
        deliveryAddress: backendData.deliveryAddress || backendData.address || 'N/A',
        
        // Current location information
        currentAddress: backendData.currentAddress || backendData.current_address || backendData.currentLocation || 'In Transit',
        
        // Additional info
        specialInstructions: backendData.specialInstructions || backendData.instructions || 'None',
        userEmail: backendData.userEmail || backendData.email || backendData.user_email || 'N/A',
        
        // Dates
        createdAt: backendData.createdAt || backendData.created || backendData.date || null
    };
}

// Helper function to extract tracking events from backend data
function extractTrackingEvents(shipment) {
    // If there are explicit tracking events in the data
    if (shipment.trackingEvents && Array.isArray(shipment.trackingEvents)) {
        return shipment.trackingEvents;
    }
    
    // Otherwise, create a simple timeline from the status
    const events = [];
    
    // Add creation event
    const createdDate = shipment.createdAt || shipment.created || shipment.date || new Date();
    events.push({
        status: 'Shipment Created',
        timestamp: createdDate,
        description: 'Your shipment has been registered in our system.'
    });
      // Add current status event if it's not just created
    if (shipment.status && shipment.status.toLowerCase() !== 'created' && shipment.status.toLowerCase() !== 'pending') {
        events.push({
            status: shipment.status,
            timestamp: shipment.updatedAt || shipment.updated || new Date(),
            description: getStatusDescription(shipment.status),
            location: shipment.currentAddress || shipment.current_address || shipment.currentLocation || null
        });
    }
    
    return events;
}

// Get a human-readable description for a status code
function getStatusDescription(status) {
    if (!status) return 'Status information not available.';
    
    // Convert to lowercase for case-insensitive matching
    const statusLower = status.toLowerCase();
    
    const descriptions = {
        'pending': 'Your shipment has been created and is awaiting processing.',
        'processing': 'We are preparing your shipment for delivery.',
        'in transit': 'Your shipment is on its way to the destination.',
        'out for delivery': 'Your shipment will be delivered today.',
        'delivered': 'Your shipment has been successfully delivered.',
        'returned': 'The shipment has been returned to the sender.',
        'cancelled': 'The shipment has been cancelled.'
    };
    
    return descriptions[statusLower] || `Status updated to: ${status}`;
}
