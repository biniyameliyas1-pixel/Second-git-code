const form = document.querySelector('.counting-form');
const messageBox = document.querySelector('#form-message');

function setLanguage(lang) {
  const locale = lang === 'am' ? 'am' : 'en';
  document.documentElement.lang = locale;

  document.querySelectorAll('[data-translate]').forEach((element) => {
    const text = element.dataset[locale];
    if (!text) return;

    const tagName = element.tagName.toUpperCase();
    if (tagName === 'INPUT') {
      const type = element.type.toLowerCase();
      if (type === 'button' || type === 'submit' || type === 'reset') {
        element.value = text;
        return;
      }
      const placeholderKey = `${locale}Placeholder`;
      if (element.dataset[placeholderKey]) {
        element.placeholder = element.dataset[placeholderKey];
      }
      return;
    }

    if (tagName === 'TEXTAREA') {
      const placeholderKey = `${locale}Placeholder`;
      if (element.dataset[placeholderKey]) {
        element.placeholder = element.dataset[placeholderKey];
      }
      return;
    }

    if (tagName === 'OPTION') {
      element.textContent = text;
      return;
    }

    if (tagName === 'LABEL') {
      const textNode = Array.from(element.childNodes).find((node) => node.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = text;
      } else {
        element.insertBefore(document.createTextNode(text), element.firstChild);
      }
      return;
    }

    element.textContent = text;
  });

  document.querySelectorAll('.lang-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === locale);
  });
}

if (form) {
  const printButton = document.querySelector('.print-btn');
  const successDialog = document.querySelector('#success-dialog');
  const dialogCloseBtn = document.querySelector('.dialog-close');
  const dialogActionBtn = document.querySelector('.dialog-action-btn');

  if (printButton) {
    printButton.addEventListener('click', () => window.print());
  }

  function showSuccessDialog() {
    successDialog.setAttribute('aria-hidden', 'false');
    successDialog.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeSuccessDialog() {
    successDialog.setAttribute('aria-hidden', 'true');
    successDialog.classList.remove('show');
    document.body.style.overflow = '';
  }

  if (dialogCloseBtn) {
    dialogCloseBtn.addEventListener('click', closeSuccessDialog);
  }

  if (dialogActionBtn) {
    dialogActionBtn.addEventListener('click', () => {
      closeSuccessDialog();
      form.reset();
    });
  }

  successDialog.addEventListener('click', (e) => {
    if (e.target === successDialog) {
      closeSuccessDialog();
    }
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });

    if (response.ok) {
      messageBox.textContent = 'Thank you! Your census form has been submitted successfully.';
      messageBox.className = 'form-message success';
      showSuccessDialog();
    } else {
      messageBox.textContent = 'Sorry, something went wrong. Please try again.';
      messageBox.className = 'form-message error';
    }
  });

  form.addEventListener('reset', () => {
    messageBox.textContent = '';
    messageBox.className = 'form-message';
  });
}

document.querySelectorAll('.lang-btn').forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

setLanguage('en');
