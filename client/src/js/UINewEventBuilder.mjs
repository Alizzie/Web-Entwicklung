import { createMainWrapper } from './UIDisplayBuilder.mjs';
import { createGuestList } from './UIGuestListBuilder.mjs';

const eventAttributes = [
  {
    name: 'Event Name',
    type: 'text',
    placeholder: 'Event name'
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
    name: 'Number of rectangular tables',
    type: 'number',
    placeholder: '0',
    min: '0'
  },
  {
    name: 'Number of seats per table',
    type: 'number',
    placeholder: '0',
    min: '0'

  },
  {
    name: 'Both sides',
    type: 'checkbox'
  }
];

export function createNewEventDisplay () {
  const main = createMainWrapper();

  main.appendChild(createHeading());
  main.appendChild(createForm());
}

function createHeading () {
  const heading = document.createElement('h1');
  heading.classList.add('uk-heading-line', 'uk-text-center');

  const text = document.createElement('span');
  text.textContent = 'Creating a new Event';
  heading.appendChild(text);
  return heading;
}

function createForm () {
  const form = document.createElement('form');
  form.action = '/';
  form.method = 'post';
  form.classList.add('eventParamsFormular');

  const eventParams = [eventAttributes, 'creation-eventAttr', 'Event Parameters'];
  const seatingParams = [seatsPlanAttributes, 'creation-seatingAttr', 'Seating Parameters'];

  createAttributSections(form, eventParams);
  createAttributSections(form, seatingParams);

  createContinueBtn(form);
  addEventListenerToForm(form);

  return form;
}

function createAttributSections (form, attrType) {
  const [attrArray, className, heading] = attrType;
  const eventAttr = document.createElement('div');
  eventAttr.classList.add('creation-attributs');

  const text = document.createElement('h2');
  text.textContent = heading;
  eventAttr.appendChild(text);

  for (const attr of attrArray) {
    const wrapper = createAttribut(attr, className);
    eventAttr.appendChild(wrapper);
  }

  form.appendChild(eventAttr);
}

function createAttribut (attr, className) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('creation-form-elements');
  wrapper.classList.add(className);

  generateParameters(wrapper, attr);

  return wrapper;
}

// Parameters with required Name and Type
function generateParameters (wrapper, attr) {
  const label = document.createElement('label');
  label.classList.add('uk-form-label');
  label.htmlFor = attr.name;
  label.textContent = attr.name;

  const input = document.createElement('input');
  input.type = attr.type;
  input.name = attr.name;

  if (attr.type === 'checkbox') {
    input.classList.add('uk-checkbox');
  } else {
    input.classList.add('uk-input', 'uk-form-small');
  }

  generateOptionalAttributes(input, attr);

  wrapper.appendChild(label);
  wrapper.appendChild(input);
}

// Optional: Placeholder, Min
function generateOptionalAttributes (input, attr) {
  if (attr.placeholder) {
    input.placeholder = attr.placeholder;
  }

  if (attr.min) {
    input.min = attr.min;
  }
}

function createContinueBtn (form) {
  const button = document.createElement('button');
  button.textContent = 'Continue to the guest list';
  button.type = 'submit';
  button.classList.add('uk-button', 'uk-button-default');
  form.appendChild(button);
}

function addEventListenerToForm (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    console.log('continuie to guestList');
    createGuestList();
  });
}
