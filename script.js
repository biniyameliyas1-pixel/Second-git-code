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

  // Validation Functions
  function validateFullName(value) {
    return value.trim().length >= 3;
  }

  function validateEmail(value) {
    if (!value) return true; // Optional field
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  }

  function validatePhone(value) {
    if (!value) return true; // Optional field
    const phoneRegex = /^09\d{8}$/;
    return phoneRegex.test(value);
  }

  function validateAge(value) {
    if (!value) return true; // Optional field
    const age = parseInt(value, 10);
    return age >= 0 && age <= 150;
  }

  function validateBloodType(value) {
    if (!value) return true; // Optional field
    const validTypes = ['A', 'B', 'AB', 'O'];
    return validTypes.includes(value.toUpperCase());
  }

  function validateNumberField(value) {
    if (!value && value !== '0') return true; // Optional field
    const num = parseInt(value, 10);
    return !isNaN(num) && num >= 0;
  }

  function validateDateOfBirth(value) {
    if (!value) return true; // Optional field
    const birthDate = new Date(value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age >= 13; // Must be at least 13 years old
    }
    return age >= 13;
  }

  function validateSelectField(value) {
    return value !== '' && value !== null;
  }

  function validateForm() {
    const errors = [];

    // Full Name - required
    const fullName = form.querySelector('input[name="full-name"]').value;
    if (!validateFullName(fullName)) {
      errors.push('Full Name must be at least 3 characters long');
    }

    // Email - optional but must be valid if filled
    const email = form.querySelector('input[name="email"]').value;
    if (!validateEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    // Phone - optional but must be valid format if filled
    const phone = form.querySelector('input[name="phone"]').value;
    if (!validatePhone(phone)) {
      errors.push('Phone must be in format 09xxxxxxxx (Ethiopian format)');
    }

    // Age - optional but must be valid if filled
    const age = form.querySelector('input[name="age"]').value;
    if (!validateAge(age)) {
      errors.push('Age must be between 0 and 150');
    }

    // Blood Type - optional but must be valid if filled
    const bloodType = form.querySelector('input[name="blood-type"]').value;
    if (!validateBloodType(bloodType)) {
      errors.push('Blood Type must be A, B, AB, or O');
    }

    // Date of Birth - optional but must be valid if filled
    const birthDate = form.querySelector('input[name="birth-date"]').value;
    if (!validateDateOfBirth(birthDate)) {
      errors.push('Person must be at least 13 years old');
    }

    // Validate all number fields
    const numberFields = [
      { name: 'family-members', label: 'Family Members' },
      { name: 'sons-count', label: 'Sons Count' },
      { name: 'daughters-count', label: 'Daughters Count' },
      { name: 'children-under-7', label: 'Children Under 7' },
      { name: 'non-orthodox-members', label: 'Non-Orthodox Members' }
    ];

    numberFields.forEach(field => {
      const value = form.querySelector(`input[name="${field.name}"]`).value;
      if (!validateNumberField(value)) {
        errors.push(`${field.label} must be a non-negative number`);
      }
    });

    // Validate required select fields
    const requiredSelects = [
      { name: 'gender', label: 'Gender' },
      { name: 'marital-status', label: 'Marital Status' },
      { name: 'has-confession-father', label: 'Confession Father' }
    ];

    requiredSelects.forEach(field => {
      const value = form.querySelector(`select[name="${field.name}"]`).value;
      if (!validateSelectField(value)) {
        errors.push(`${field.label} is required`);
      }
    });

    return errors;
  }

  function displayValidationErrors(errors) {
    if (errors.length === 0) return true;

    const errorMessage = errors.join('\n');
    messageBox.textContent = `Validation errors:\n${errorMessage}`;
    messageBox.className = 'form-message error';
    messageBox.style.whiteSpace = 'pre-wrap';
    window.scrollTo(0, 0);
    return false;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Validate form before submission
    const validationErrors = validateForm();
    if (!displayValidationErrors(validationErrors)) {
      return;
    }

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
      messageBox.style.whiteSpace = 'normal';
      showSuccessDialog();
    } else {
      messageBox.textContent = 'Sorry, something went wrong. Please try again.';
      messageBox.className = 'form-message error';
    }
  });

  form.addEventListener('reset', () => {
    messageBox.textContent = '';
    messageBox.className = 'form-message';
    messageBox.style.whiteSpace = 'normal';
  });
}

document.querySelectorAll('.lang-btn').forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

setLanguage('en');
