// QR Code print function
window.printQRCode = function(qrCodeData, trackingId, recipientName) {
    const printWindow = window.open('', '_blank', 'width=600,height=600');
    
    // Use string concatenation instead of template literals to avoid issues with nested JavaScript
    const printContent = 
        '<!DOCTYPE html>' +
        '<html>' +
        '<head>' +
            '<title>Parcel QR Code - ' + trackingId + '</title>' +
            '<style>' +
                'body {' +
                    'font-family: Arial, sans-serif;' +
                    'text-align: center;' +
                    'padding: 20px;' +
                '}' +
                '.qr-container {' +
                    'margin: 0 auto;' +
                    'max-width: 300px;' +
                    'border: 1px solid #ddd;' +
                    'padding: 20px;' +
                    'border-radius: 5px;' +
                '}' +
                '.qr-code {' +
                    'width: 200px;' +
                    'height: 200px;' +
                '}' +
                '.tracking-id {' +
                    'font-size: 14px;' +
                    'font-weight: bold;' +
                    'margin-top: 10px;' +
                '}' +
                '.recipient {' +
                    'font-size: 12px;' +
                    'color: #666;' +
                    'margin-top: 5px;' +
                '}' +
                '.instructions {' +
                    'font-size: 10px;' +
                    'color: #999;' +
                    'margin-top: 15px;' +
                '}' +
                '.print-date {' +
                    'font-size: 10px;' +
                    'color: #999;' +
                    'margin-top: 15px;' +
                '}' +
            '</style>' +
        '</head>' +
        '<body>' +
            '<div class="qr-container">' +
                '<img class="qr-code" src="data:image/png;base64,' + qrCodeData + '" alt="QR Code">' +
                '<div class="tracking-id">Tracking ID: ' + trackingId + '</div>' +                '<div class="recipient">Recipient: ' + recipientName + '</div>' +                '<div class="instructions">' +
                    'Scan this QR code with your phone camera<br>' +
                    'https://raghavvag.github.io/parcel_tracking_frontend/shipment-tracking.html?tracking=' + trackingId +
                '</div>'+
                '<div class="print-date">Printed: ' + new Date().toLocaleString() + '</div>' +
            '</div>' +
            '<script>' +
                'window.onload = function() {' +
                    'window.print();' +
                '};' +
            '</script>' +
        '</body>' +
        '</html>';
    
    printWindow.document.write(printContent);
    printWindow.document.close();
}
