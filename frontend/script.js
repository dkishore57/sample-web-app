function addUser() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;

  // Validate name and email before sending request
  if (!name || !email) {
    alert('Name and email are required');
    return;
  }

  // Send POST request to backend API
  fetch('/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email }),
  })
  .then(response => {
    if (!response.ok) {
      // If response is not OK (e.g., duplicate email)
      return response.json().then(errorData => {
        throw new Error(errorData.error);  // Handle the error message from the backend
      });
    }
    return response.text();
  })
  .then(data => {
    // Display success message
    document.getElementById('response-message').textContent = 'Check your email for further information';
    document.getElementById('response-message').style.color = 'green';
  })
  .catch(err => {
    console.error('Error:', err);
    // Display error message for duplicate email or other errors
    document.getElementById('response-message').textContent = err.message;
    document.getElementById('response-message').style.color = 'red';
  });
}
