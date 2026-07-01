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

// Validation Rules
const validationRules = {
  'full-name': { required: true, type: 'text', minLength: 2, maxLength: 100 },
  'christian-name': { required: false, type: 'text', maxLength: 100 },
  'parent-name': { required: false, type: 'text', maxLength: 100 },
  'gender': { required: true, type: 'select' },
  'birth-date': { required: false, type: 'date', notFuture: true },
  'age': { required: false, type: 'number', min: 0, max: 150 },
  'blood-type': { required: false, type: 'text', pattern: /^[AB]{0,2}O?[+-]?$|^[AB]{0,2}O?/ },
  'phone': { required: false, type: 'tel', pattern: /^\d{7,}$/ },
  'email': { required: false, type: 'email' },
  'current-church': { required: false, type: 'text', maxLength: 100 },
  'region': { required: false, type: 'text', maxLength: 50 },
  'zone': { required: false, type: 'text', maxLength: 50 },
  'woreda': { required: false, type: 'text', maxLength: 50 },
  'kebele': { required: false, type: 'text', maxLength: 50 },
  'village': { required: false, type: 'text', maxLength: 50 },
  'house-number': { required: false, type: 'text', maxLength: 20 },
  'marital-status': { required: false, type: 'select' },
  'family-members': { required: false, type: 'number', min: 0, max: 999 },
  'sons-count': { required: false, type: 'number', min: 0, max: 999 },
  'daughters-count': { required: false, type: 'number', min: 0, max: 999 },
  'children-under-7': { required: false, type: 'number', min: 0, max: 999 },
  'children-baptized': { required: false, type: 'select' },
  'all-household-orthodox': { required: false, type: 'select' },
  'non-orthodox-members': { required: false, type: 'number', min: 0, max: 999 },
  'special-support-needed': { required: false, type: 'select' },
  'support-details': { required: false, type: 'text', maxLength: 200 },
  'has-confession-father': { required: false, type: 'select' },
  'confession-father-name': { required: false, type: 'text', maxLength: 100 },
  'confession-father-church': { required: false, type: 'text', maxLength: 100 },
  'communion-attendance': { required: false, type: 'select' },
  'fasting-practice': { required: false, type: 'select' },
  'attendance-habit': { required: false, type: 'select' },
  'family-prayer-time': { required: false, type: 'select' },
  'prayer-book-reading': { required: false, type: 'select' },
  'sunday-school-member': { required: false, type: 'select' },
  'association-name': { required: false, type: 'text', maxLength: 100 },
  'education-level': { required: false, type: 'select' },
  'church-education': { required: false, type: 'select' },
  'occupation-sector': { required: false, type: 'select' },
  'main-profession': { required: false, type: 'text', maxLength: 100 },
  'registered-parish': { required: false, type: 'select' },
  'parish-contribution': { required: false, type: 'select' },
  'tithe-offering': { required: false, type: 'select' },
  'desired-service': { required: false, type: 'text', maxLength: 200 },
  'parish-feedback': { required: false, type: 'textarea', maxLength: 1000 }
};

// Validation Functions
function validateField(fieldName, value) {
  const rules = validationRules[fieldName];
  if (!rules) return { valid: true, errors: [] };

  const errors = [];

  // Required validation
  if (rules.required && (!value || value.trim() === '')) {
    errors.push(`${fieldName} is required`);
    return { valid: false, errors };
  }

  // Skip validation for empty optional fields
  if (!rules.required && (!value || value.trim() === '')) {
    return { valid: true, errors: [] };
  }

  // Text validations
  if (rules.type === 'text' || rules.type === 'textarea') {
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${fieldName} must be at least ${rules.minLength} characters`);
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${fieldName} must not exceed ${rules.maxLength} characters`);
    }
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(`${fieldName} has invalid format`);
    }
  }

  // Email validation
  if (rules.type === 'email' && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      errors.push(`${fieldName} must be a valid email address`);
    }
  }

  // Phone validation
  if (rules.type === 'tel' && value) {
    const phoneRegex = /^\d{7,}$/;
    if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
      errors.push(`${fieldName} must be at least 7 digits`);
    }
  }

  // Number validations
  if (rules.type === 'number') {
    const num = parseInt(value, 10);
    if (isNaN(num)) {
      errors.push(`${fieldName} must be a valid number`);
    } else {
      if (rules.min !== undefined && num < rules.min) {
        errors.push(`${fieldName} must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && num > rules.max) {
        errors.push(`${fieldName} must not exceed ${rules.max}`);
      }
    }
  }

  // Date validations
  if (rules.type === 'date' && value) {
    const date = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (rules.notFuture && date > today) {
      errors.push(`${fieldName} cannot be in the future`);
    }
  }

  return { valid: errors.length === 0, errors };
}

function validateAllFields() {
  const formElements = form.querySelectorAll('input, select, textarea');
  const validationResults = {};
  let hasErrors = false;

  formElements.forEach((field) => {
    const fieldName = field.name;
    if (!fieldName || !validationRules[fieldName]) return;

    const value = field.type === 'checkbox' ? (field.checked ? 'true' : '') : field.value;
    const result = validateField(fieldName, value);
    
    if (!result.valid) {
      hasErrors = true;
      validationResults[fieldName] = result;
      field.classList.add('invalid');
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.classList.remove('invalid');
      field.setAttribute('aria-invalid', 'false');
    }
  });

  return { valid: !hasErrors, results: validationResults };
}

function clearValidationErrors() {
  form.querySelectorAll('.invalid').forEach((field) => {
    field.classList.remove('invalid');
    field.setAttribute('aria-invalid', 'false');
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

  // Real-time validation on field blur
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('blur', () => {
      const fieldName = field.name;
      if (!fieldName || !validationRules[fieldName]) return;

      const value = field.type === 'checkbox' ? (field.checked ? 'true' : '') : field.value;
      const result = validateField(fieldName, value);

      if (!result.valid) {
        field.classList.add('invalid');
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.classList.remove('invalid');
        field.setAttribute('aria-invalid', 'false');
      }
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    clearValidationErrors();
    const validation = validateAllFields();

    if (!validation.valid) {
      const errorCount = Object.keys(validation.results).length;
      messageBox.textContent = `Please fix ${errorCount} validation error(s) before submitting.`;
      messageBox.className = 'form-message error';
      return;
    }

    messageBox.textContent = '';
    messageBox.className = 'form-message';

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
    clearValidationErrors();
  });
}

document.querySelectorAll('.lang-btn').forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

setLanguage('en');
