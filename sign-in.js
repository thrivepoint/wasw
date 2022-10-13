const signInButton = document.getElementById('sign-in-btn');
const message = document.getElementById('message-wrapper');

signInButton.addEventListener("click", signIn);

function signIn() {

  const data = {
    "email": document.getElementById('email').value,
    "password": document.getElementById('password').value
  }; 

  fetch("https://x8ki-letl-twmt.n7.xano.io/api:Jw42rGBY/auth/login", {
    method: "POST",
    headers: {
            'Content-Type': 'application/json'
          },
    body: JSON.stringify(data)
  })
  .then(response => {
    if (!response.ok) {
      message.style.display = "block"
      throw new Error("Error! Status: "+response.status);
    }
    return response.json()
  })
  .then(data => {
    console.log('Success:', data);
    const authToken = data.authToken;
    localStorage.setItem('authToken', authToken)
    window.location.href = '/dashboard'
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}
