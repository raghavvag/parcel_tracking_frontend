/**
 * Tracking Utilities for the Parcel Tracking System
 * Contains shared utility functions for tracking-related features
 */

// Format dates for consistent display across the application
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        
        // Format with locale-specific date and time
        return date.toLocaleString();
    } catch (error) {
        console.error('Error formatting date:', error);
        return 'Error';
    }
}

// Format a date in a more human-readable way (e.g. "2 days ago" or "Today at 2:30 PM")
function formatDateRelative(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        const now = new Date();
        
        // Check if the date is valid
        if (isNaN(date.getTime())) {
            return 'Invalid Date';
        }
        
        // Calculate difference in days
        const diffTime = now - date;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        // Format based on how recent the date is
        if (diffDays === 0) {
            // Today - show time
            return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays === 1) {
            // Yesterday
            return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        } else if (diffDays < 7) {
            // Within the last week
            return `${diffDays} days ago`;
        } else {
            // More than a week ago - show full date
            return date.toLocaleDateString();
        }
    } catch (error) {
        console.error('Error formatting relative date:', error);
        return 'Error';
    }
}

// Generate a printable version of the tracking information
function generatePrintView(shipment) {
    // Create a new window for printing
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    // Build the print HTML
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Shipment Tracking: ${shipment.trackingId || shipment.id}</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    line-height: 1.5;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                }
                .shipping-info {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }
                .shipping-info div {
                    width: 48%;
                }
                .status {
                    font-weight: bold;
                    font-size: 18px;
                    margin: 15px 0;
                }
                .timeline-item {
                    margin-bottom: 15px;
                    padding-bottom: 15px;
                    border-bottom: 1px solid #eee;
                }
                .timeline-date {
                    color: #666;
                    font-size: 14px;
                }
                .footer {
                    margin-top: 50px;
                    font-size: 12px;
                    text-align: center;
                    color: #666;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                th, td {
                    padding: 8px;
                    text-align: left;
                    border-bottom: 1px solid #ddd;
                }
                th {
                    background-color: #f2f2f2;
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Shipment Tracking Details</h1>
                <h2>Tracking ID: ${shipment.trackingId || shipment.id}</h2>
                <p class="status">Status: ${shipment.status || 'Pending'}</p>
            </div>
              <div class="shipping-info">
                <div>
                    <h3>Shipment Information</h3>
                    <table>
                        <tr>
                            <th>Package Type</th>
                            <td>${shipment.packageType || 'Standard Package'}</td>
                        </tr>
                        <tr>
                            <th>Weight</th>
                            <td>${shipment.weight ? `${shipment.weight}` : 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Created</th>
                            <td>${formatDate(shipment.createdAt)}</td>
                        </tr>
                        ${shipment.currentAddress && shipment.currentAddress !== 'In Transit' && shipment.currentAddress !== 'N/A' ? 
                        `<tr>
                            <th>Current Location</th>
                            <td>${shipment.currentAddress}</td>
                        </tr>` : ''}
                    </table>
                </div>
                <div>
                    <h3>Delivery Information</h3>
                    <table>
                        <tr>
                            <th>Recipient</th>
                            <td>${shipment.recipientName || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Address</th>
                            <td>${shipment.deliveryAddress || 'N/A'}</td>
                        </tr>
                        <tr>
                            <th>Special Instructions</th>
                            <td>${shipment.specialInstructions || 'None'}</td>
                        </tr>
                    </table>
                </div>
            </div>
            
            <h3>Tracking Timeline</h3>
            <div class="timeline">
                ${generateTimelineHTML(shipment)}
            </div>
            
            <div class="footer">
                <p>This is an automatically generated tracking information. Printed on ${new Date().toLocaleString()}</p>
                <p>For customer support, please contact us at support@parceltracking.com</p>
            </div>
            
            <script>
                // Auto print when loaded
                window.onload = function() {
                    window.print();
                }
            </script>
        </body>
        </html>
    `;
    
    // Write content to the print window
    printWindow.document.write(printContent);
    printWindow.document.close();
}

// Helper function to generate timeline HTML for print view
function generateTimelineHTML(shipment) {
    let timelineHTML = '';
    
    // Create events array
    const events = [];
    
    // Add shipment creation as first event
    events.push({
        status: 'Shipment Created',
        timestamp: shipment.createdAt || shipment.created || shipment.date,
        description: 'Your shipment has been registered in our system.'
    });
      // Add current status if different from created
    if (shipment.status && shipment.status.toLowerCase() !== 'created' && shipment.status.toLowerCase() !== 'pending') {
        events.push({
            status: shipment.status,
            timestamp: shipment.updatedAt || shipment.updated || new Date(),
            description: getStatusDescription(shipment.status),
            location: shipment.currentAddress || null
        });
    }
    
    // Add any tracking events if present
    if (shipment.trackingEvents && Array.isArray(shipment.trackingEvents) && shipment.trackingEvents.length > 0) {
        events.push(...shipment.trackingEvents);
    }
    
    // Sort events by date
    events.sort((a, b) => {
        const dateA = a.timestamp ? new Date(a.timestamp) : new Date(0);
        const dateB = b.timestamp ? new Date(b.timestamp) : new Date(0);
        return dateB - dateA; // Newest first
    });
      // Generate HTML for each event
    events.forEach(event => {
        const eventDate = event.timestamp ? formatDate(event.timestamp) : 'N/A';
        const locationHtml = event.location ? `<p style="color:#1976d2"><strong>Location:</strong> ${event.location}</p>` : '';
        
        timelineHTML += `
            <div class="timeline-item">
                <h4>${event.status || 'Status Update'}</h4>
                <p class="timeline-date">${eventDate}</p>
                ${locationHtml}
                <p>${event.description || getStatusDescription(event.status)}</p>
            </div>
        `;
    });
    
    return timelineHTML || '<p>No tracking information available.</p>';
}

// Share tracking information
function shareTracking(trackingId) {
    // Check if the Web Share API is available
    if (navigator.share) {
        const shareUrl = `${window.location.origin}/shipment-tracking.html?tracking=${trackingId}&source=shared`;
        
        navigator.share({
            title: `Parcel Tracking - ${trackingId}`,
            text: `Track my shipment with tracking number: ${trackingId}`,
            url: shareUrl
        }).then(() => {
            console.log('Tracking information shared successfully');
        }).catch(error => {
            console.error('Error sharing tracking information:', error);
            fallbackShare(shareUrl, trackingId);
        });
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = `${window.location.origin}/shipment-tracking.html?tracking=${trackingId}&source=shared`;
        fallbackShare(shareUrl, trackingId);
    }
}

// Fallback sharing method (copy to clipboard)
function fallbackShare(shareUrl, trackingId) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    
    // Set the input value to the tracking URL
    tempInput.value = shareUrl;
    
    // Select the input content
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    
    // Copy to clipboard
    document.execCommand('copy');
    
    // Remove the temporary input
    document.body.removeChild(tempInput);
    
    // Notify the user
    alert(`Tracking URL copied to clipboard: ${shareUrl}`);
}

// Copy tracking ID to clipboard
function copyTrackingId(trackingId) {
    // Create a temporary input element
    const tempInput = document.createElement('input');
    document.body.appendChild(tempInput);
    
    // Set the input value to the tracking ID
    tempInput.value = trackingId;
    
    // Select the input content
    tempInput.select();
    tempInput.setSelectionRange(0, 99999); // For mobile devices
    
    // Copy to clipboard
    document.execCommand('copy');
    
    // Remove the temporary input
    document.body.removeChild(tempInput);
    
    // Show confirmation
    const confirmationToast = document.createElement('div');
    confirmationToast.className = 'copy-toast fade-in';
    confirmationToast.textContent = '✓ Tracking ID copied to clipboard';
    
    // Style the toast
    confirmationToast.style.position = 'fixed';
    confirmationToast.style.bottom = '20px';
    confirmationToast.style.left = '50%';
    confirmationToast.style.transform = 'translateX(-50%)';
    confirmationToast.style.padding = '8px 16px';
    confirmationToast.style.backgroundColor = '#333';
    confirmationToast.style.color = '#fff';
    confirmationToast.style.borderRadius = '4px';
    confirmationToast.style.zIndex = '1000';
    
    // Add to document
    document.body.appendChild(confirmationToast);
    
    // Remove after a delay
    setTimeout(() => {
        confirmationToast.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(confirmationToast);
        }, 300);
    }, 2000);
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
