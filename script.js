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

  // ========== VALIDATION FUNCTIONS ==========

  function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function validatePhone(phone) {
    const phoneRegex = /^[0-9\s\-\+\(\)]{9,}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  function validateText(text, minLength = 2) {
    return text.trim().length >= minLength && text.trim().length <= 100;
  }

  function validateAge(age) {
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum >= 0 && ageNum <= 150;
  }

  function validateNumber(num, min = 0, max = 1000) {
    const numVal = parseInt(num);
    return !isNaN(numVal) && numVal >= min && numVal <= max;
  }

  function validateBloodType(type) {
    const bloodTypes = ['A', 'B', 'AB', 'O', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    return type === '' || bloodTypes.includes(type.toUpperCase());
  }

  function validateForm() {
    const errors = [];
    const currentLocale = document.documentElement.lang || 'en';
    
    // Get all inputs and select fields
    const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="number"], input[type="date"], select, textarea');

    inputs.forEach((input) => {
      const fieldName = input.name;
      const fieldValue = input.value.trim();
      const isRequired = input.hasAttribute('required');
      
      // Skip optional empty fields
      if (!isRequired && fieldValue === '') {
        return;
      }

      // Check required fields
      if (isRequired && fieldValue === '') {
        const fieldLabel = form.querySelector(`label:has([name="${fieldName}"])`);
        const label = fieldLabel ? fieldLabel.textContent.split('\n')[0].trim() : fieldName;
        errors.push(`${label} is required`);
        input.classList.add('input-error');
        return;
      }

      input.classList.remove('input-error');

      // Validate specific field types
      switch (fieldName) {
        case 'email':
          if (fieldValue && !validateEmail(fieldValue)) {
            errors.push('Please enter a valid email address');
            input.classList.add('input-error');
          }
          break;

        case 'phone':
          if (fieldValue && !validatePhone(fieldValue)) {
            errors.push('Please enter a valid phone number (at least 9 digits)');
            input.classList.add('input-error');
          }
          break;

        case 'full-name':
          if (fieldValue && !validateText(fieldValue, 2)) {
            errors.push('Full name must be between 2-100 characters');
            input.classList.add('input-error');
          }
          break;

        case 'christian-name':
        case 'parent-name':
        case 'current-church':
        case 'confession-father-name':
        case 'occupation':
        case 'region':
        case 'zone':
        case 'woreda':
        case 'kebele':
        case 'village':
        case 'house-number':
        case 'support-details':
          if (fieldValue && !validateText(fieldValue, 1)) {
            errors.push(`${fieldName.replace(/-/g, ' ')} must be 1-100 characters`);
            input.classList.add('input-error');
          }
          break;

        case 'blood-type':
          if (fieldValue && !validateBloodType(fieldValue)) {
            errors.push('Blood type must be A, B, AB, or O (with + or - optional)');
            input.classList.add('input-error');
          }
          break;

        case 'age':
          if (fieldValue && !validateAge(fieldValue)) {
            errors.push('Age must be between 0-150 years');
            input.classList.add('input-error');
          }
          break;

        case 'family-members':
        case 'sons-count':
        case 'daughters-count':
        case 'children-under-7':
        case 'non-orthodox-members':
          if (fieldValue !== '' && !validateNumber(fieldValue, 0, 500)) {
            errors.push(`${fieldName.replace(/-/g, ' ')} must be a valid number (0-500)`);
            input.classList.add('input-error');
          }
          break;
      }
    });

    return errors;
  }

  // Add real-time validation feedback
  form.querySelectorAll('input[type="email"]').forEach((input) => {
    input.addEventListener('blur', () => {
      if (input.value && !validateEmail(input.value)) {
        input.classList.add('input-error');
      } else {
        input.classList.remove('input-error');
      }
    });
  });

  form.querySelectorAll('input[type="tel"]').forEach((input) => {
    input.addEventListener('blur', () => {
      if (input.value && !validatePhone(input.value)) {
        input.classList.add('input-error');
      } else {
        input.classList.remove('input-error');
      }
    });
  });

  form.querySelectorAll('input[type="number"]').forEach((input) => {
    input.addEventListener('blur', () => {
      if (input.value === '') return;
      const min = parseInt(input.getAttribute('min')) || 0;
      const max = parseInt(input.getAttribute('max')) || 1000;
      const val = parseInt(input.value);
      if (isNaN(val) || val < min || val > max) {
        input.classList.add('input-error');
      } else {
        input.classList.remove('input-error');
      }
    });
  });


  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Clear previous error state
    form.querySelectorAll('.input-error').forEach((input) => {
      input.classList.remove('input-error');
    });

    // Validate all fields
    const validationErrors = validateForm();

    if (validationErrors.length > 0) {
      const errorMessage = validationErrors.join('\n• ');
      messageBox.textContent = '❌ Please fix the following errors:\n• ' + errorMessage;
      messageBox.className = 'form-message error';
      messageBox.style.whiteSpace = 'pre-wrap';
      return;
    }

    // Validation passed, submit the form
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
