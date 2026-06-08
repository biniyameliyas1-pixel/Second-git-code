document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (!form || !status) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    status.textContent = 'Sending message...';
    status.className = 'form-status info';

    const formData = new FormData(form);
    const payload = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        status.textContent = 'Message sent successfully!';
        status.className = 'form-status success';
        form.reset();
      } else {
        status.textContent = result.error || 'Unable to send your message.';
        status.className = 'form-status error';
      }
    } catch (error) {
      status.textContent = 'Network error. Please try again later.';
      status.className = 'form-status error';
      console.error(error);
    }
  });
});
