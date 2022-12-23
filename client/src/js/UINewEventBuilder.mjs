import { resetMain } from './UIGenerator.mjs';

const eventAttributes = [
  {
    name: 'Event Name',
    type: 'text'
  },
  {
    name: 'Date',
    type: 'date'
  },
  {
    name: 'Time',
    type: 'time'
  }
];

const seatsPlanAttributes = [
  {
    name: 'Anzahl rechteckiger Tische',
    type: 'number'
  },
  {
    name: 'Anzahl Sitzplätze pro Tisch',
    type: 'number'
  },
  {
    name: 'Beidseitig',
    type: 'checkbox'
  }
];

export function createNewEventDisplay () {
  const main = resetMain();
  main.classList.add('creation-wrapper');

  const form = document.createElement('form');

  createEventAttributs(form);
  createSeatingPlan(form);

  main.appendChild(form);
}

function createEventAttributs (form) {
  const eventAttr = document.createElement('div');

  for (const attr of eventAttributes) {
    const wrapper = createAttribut(attr);
    eventAttr.appendChild(wrapper);
  }

  form.appendChild(eventAttr);
}

function createSeatingPlan (form) {
  const seatsAttr = document.createElement('div');

  for (const attr of seatsPlanAttributes) {
    const wrapper = createAttribut(attr);
    seatsAttr.appendChild(wrapper);
  }

  form.appendChild(seatsAttr);
}

function createAttribut (attr) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('creation-form-elements');

  const label = document.createElement('label');
  label.htmlFor = attr.name;
  label.textContent = attr.name;

  const input = document.createElement('input');
  input.type = attr.type;
  input.name = attr.name;

  wrapper.appendChild(label);
  wrapper.appendChild(input);

  return wrapper;
}
