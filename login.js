document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const messageDiv = document.getElementById('loginMessage');
    messageDiv.textContent = '';

    try {
        const response = await fetch('https://localhost:5001/api/Login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        let data = {};
        try {
            data = await response.json();
        } catch (jsonErr) {
            // If response is not JSON, keep data as empty object
        }
        if (response.ok) {
            messageDiv.style.color = '#388e3c';
            messageDiv.textContent = data.message || 'Login successful! Redirecting...';
            
            // Store user information in localStorage for later use
            if (data.user) {
                localStorage.setItem('currentUser', JSON.stringify(data.user));
            }
            
            // Redirect based on user role from server response
            setTimeout(() => {
                if (data.user && data.user.role) {
                    const userRole = data.user.role.toLowerCase();
                    switch(userRole) {
                        case 'admin':
                            window.location.href = 'dashboard.html'; // Admin dashboard
                            break;
                        case 'sender':
                            window.location.href = 'sender-dashboard.html'; // Sender dashboard
                            break;
                        case 'handler':
                            window.location.href = 'handler-dashboard.html'; // Handler dashboard
                            break;
                        default:
                            window.location.href = 'dashboard.html'; // Default dashboard
                    }
                } else {
                    // Fallback if role isn't returned
                    window.location.href = 'dashboard.html';
                }
            }, 1000);
        } else {
            messageDiv.style.color = '#d32f2f';
            // Show backend message if present, otherwise generic error
            messageDiv.textContent = data.message || 'Invalid email or password';
        }
    } catch (err) {
        messageDiv.style.color = '#d32f2f';
        messageDiv.textContent = 'Error connecting to server.';
    }
});