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
  return Number(value) || 0;
}

function updateTotals() {
  const attendance = [
    fields.men,
    fields.women,
    fields.youth,
    fields.children,
    fields.visitors,
    fields.couples
  ].reduce((sum, input) => sum + toNumber(input.value), 0);

  const offeringValue = toNumber(fields.offering.value);
  const specialValue = toNumber(fields.specialOffering.value);
  const titheValue = toNumber(fields.tithe.value);
  const totalGiving = offeringValue + specialValue + titheValue;

  fields.totalAttendance.value = attendance;
  fields.summaryAttendance.textContent = attendance;
  fields.summaryOffering.textContent = totalGiving.toFixed(2);
  fields.summaryGiving.textContent = totalGiving.toFixed(2);
  fields.summaryCommunion.textContent = toNumber(fields.communion.value);
}

const printButton = document.querySelector('#print-button');

if (form) {
  form.addEventListener('input', updateTotals);
  form.addEventListener('reset', () => {
    window.requestAnimationFrame(updateTotals);
  });
}

if (printButton) {
  printButton.addEventListener('click', () => {
    window.print();
  });
}

updateTotals();
