const form = document.querySelector('.counting-form');
const fields = {
  men: document.querySelector('input[name="men"]'),
  women: document.querySelector('input[name="women"]'),
  youth: document.querySelector('input[name="youth"]'),
  children: document.querySelector('input[name="children"]'),
  visitors: document.querySelector('input[name="visitors"]'),
  couples: document.querySelector('input[name="couples"]'),
  communion: document.querySelector('input[name="communion"]'),
  offering: document.querySelector('input[name="regular-offering"]'),
  specialOffering: document.querySelector('input[name="special-offering"]'),
  tithe: document.querySelector('input[name="tithe"]'),
  totalAttendance: document.querySelector('#total-attendance'),
  summaryAttendance: document.querySelector('#summary-attendance'),
  summaryOffering: document.querySelector('#summary-offering'),
  summaryGiving: document.querySelector('#summary-giving'),
  summaryCommunion: document.querySelector('#summary-communion')
};

function toNumber(value) {
  const parsedValue = Number(value);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function updateTotals() {
  const attendanceInputs = [
    fields.men,
    fields.women,
    fields.youth,
    fields.children,
    fields.visitors,
    fields.couples
  ].filter(Boolean);
  const attendance = attendanceInputs.reduce((sum, input) => sum + toNumber(input.value), 0);

  const offeringValue = toNumber(fields.offering?.value);
  const specialValue = toNumber(fields.specialOffering?.value);
  const titheValue = toNumber(fields.tithe?.value);
  const totalGiving = offeringValue + specialValue + titheValue;

  if (fields.totalAttendance) {
    fields.totalAttendance.value = attendance;
  }

  if (fields.summaryAttendance) {
    fields.summaryAttendance.textContent = attendance;
  }

  if (fields.summaryOffering) {
    fields.summaryOffering.textContent = totalGiving.toFixed(2);
  }

  if (fields.summaryGiving) {
    fields.summaryGiving.textContent = totalGiving.toFixed(2);
  }

  if (fields.summaryCommunion) {
    fields.summaryCommunion.textContent = toNumber(fields.communion?.value);
  }
}

function setLanguage(lang) {
  document.documentElement.lang = lang === 'am' ? 'am' : 'en';
  document.querySelectorAll('[data-en]').forEach((element) => {
    const text = element.getAttribute(`data-${lang}`);
    if (text) {
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT' || element.tagName === 'BUTTON') {
        element.value = text;
      } else {
        element.textContent = text;
      }
    }
  });

  document.querySelectorAll('.lang-btn').forEach((button) => {
    button.classList.toggle('active', button.dataset.lang === lang);
  });
}

if (form) {
  form.addEventListener('input', updateTotals);
  form.addEventListener('reset', () => {
    window.requestAnimationFrame(updateTotals);
  });

  const printButton = document.querySelector('.print-btn');
  const messageBox = document.querySelector('#form-message');

  if (printButton) {
    printButton.addEventListener('click', () => window.print());
  }

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
      messageBox.textContent = 'Thank you! Your church member registration has been submitted.';
      messageBox.className = 'form-message success';
      form.reset();
      updateTotals();
    } else {
      messageBox.textContent = 'Sorry, something went wrong. Please try again.';
      messageBox.className = 'form-message error';
    }
  });
}

document.querySelectorAll('.lang-btn').forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

setLanguage('en');
updateTotals();
