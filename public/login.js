const loginForm = document.getElementById('loginForm');
const loginUsername = document.getElementById('loginUsername');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');

async function checkExistingSession() {
  try {
    const response = await fetch('/api/session');
    if (response.ok) {
      window.location.href = '/index.html';
    }
  } catch {
    // Sin conexión disponible, permanece en el login.
  }
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.hidden = true;

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: loginUsername.value.trim(),
        password: loginPassword.value
      })
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error || 'No se pudo iniciar sesión');
    }

    window.location.href = '/index.html';
  } catch (error) {
    loginError.textContent = error.message;
    loginError.hidden = false;
  }
});

checkExistingSession();
