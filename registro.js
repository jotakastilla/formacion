const form = document.getElementById('registrationForm');
const submitBtn = document.getElementById('submitBtn');
const statusEl = document.getElementById('formStatus');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando...';
    }
    if (statusEl) statusEl.textContent = '';

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: {
          Accept: 'application/json'
        }
      });

      if (!response.ok) throw new Error('Formspree request failed');
      window.location.href = 'gracias.html';
    } catch (error) {
      if (statusEl) {
        statusEl.textContent =
          'No se pudo enviar el formulario. Inténtalo de nuevo en unos segundos.';
      }
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Solicitar información';
      }
    }
  });
}
