// API_BASE_URL is defined in apiConfig.js

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const phoneNumber = document.getElementById('signupPhone').value; // Changed from phone to phoneNumber
    const password = document.getElementById('signupPassword').value;
    const role = document.getElementById('signupRole').value;
    
    const messageDiv = document.getElementById('signupMessage');
    messageDiv.textContent = '';

    try {
        // Log data being sent to the API for debugging
        console.log('Sending data to server:', { name, email, phoneNumber, password, role });
        
        const response = await fetch(`${API_BASE_URL}/api/User`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                firstName: name.split(' ')[0],  // Split name into firstName and lastName
                lastName: name.split(' ').slice(1).join(' '), // Everything after first name is lastName
                email, 
                phoneNumber, // Changed from phone to phoneNumber to match backend model
                password, 
                role 
            })
        });
        const data = await response.json();
        
        // Log the server response for debugging
        console.log('Server response:', data);
        
        if (response.ok) {
            messageDiv.style.color = '#388e3c';
            messageDiv.textContent = 'Signup successful! Redirecting to login...';
            
            // Store user info if available
            if (data.user) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            
            // Redirect to login page after signup
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 1500);
        } else {
            messageDiv.style.color = '#d32f2f';
            messageDiv.textContent = data.message || 'Signup failed.';
        }
    } catch (err) {
        console.error('Error:', err);
        messageDiv.style.color = '#d32f2f';
        messageDiv.textContent = 'Error connecting to server.';
    }
});