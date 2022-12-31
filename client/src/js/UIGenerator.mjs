const main = document.getElementsByTagName('main')[0];

// RESET MAIN CONTENT UI
export function resetMain () {
  main.textContent = '';
  main.className = '';

  return main;
}

// CARD DISPLAY UI
export function createCardDisplay () {
  const main = resetMain();
  const div = document.createElement('div');
  main.appendChild(div);

  const classes = ['uk-card', 'uk-card-default', 'uk-card-large', 'uk-width-1-2', 'uk-padding-large', 'uk-card-hover', 'display-wrapper'];

  for (const newClass of classes) {
    div.classList.add(newClass);
  }

  return div;
}

// CARD FORMULAR UI
export function createCardFormularDisplay (heading, className, btnTxt, params) {
  const card = createCardDisplay();
  card.classList.add(className);

  card.appendChild(createHeading(heading));
  card.appendChild(createForm(params, btnTxt));
}

function createHeading (headingText) {
  const heading = document.createElement('h1');
  heading.classList.add('uk-heading-line', 'uk-text-center');

  const text = document.createElement('span');
  text.textContent = headingText;
  heading.appendChild(text);
  return heading;
}

function createForm (params, btnTxt) {
  const form = document.createElement('form');
  form.method = 'post';
  form.action = '/';
  form.setAttribute('id', 'formular');
  form.classList.add('event-params-formular');

  const div = document.createElement('div');
  createFormForEvent(div, params);

  form.appendChild(div);
  form.appendChild(createBtn(btnTxt));

  return form;
}

function createFormForEvent (element, params) {
  for (const param of params) {
    element.appendChild(createAttributSections(param));
  }
}

function createAttributSections (attrType) {
  const [attrArray, className, heading] = attrType;
  const fieldset = document.createElement('fieldset');
  fieldset.classList.add('uk-fieldset');

  const text = document.createElement('legend');
  text.textContent = heading;
  fieldset.appendChild(text);

  for (const attr of attrArray) {
    const wrapper = createAttribut(attr, className);
    fieldset.appendChild(wrapper);
  }

  return fieldset;
}

function createAttribut (attr, className) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('creation-form-elements');
  wrapper.classList.add(className);

  generateParameters(wrapper, attr);

  return wrapper;
}

function generateParameters (wrapper, attr) {
  const label = document.createElement('label');
  label.classList.add('uk-form-label');
  label.htmlFor = attr.name;
  label.textContent = attr.name;

  const input = checkAttributes(attr);
  generateOptionalAttributes(input, attr);

  wrapper.appendChild(label);
  wrapper.appendChild(input);
}

function checkAttributes (attr) {
  let input;
  if (attr.type === 'select') {
    input = document.createElement('select');
    input.classList.add('uk-select', 'uk-form-small');
    input.ariaLabel = 'Select';
    input.name = attr.name;
    generateSelectOptions(input, attr.options);
  } else {
    input = document.createElement('input');
    input.type = attr.type;
    input.name = attr.name;

    if (attr.type === 'checkbox') {
      input.classList.add('uk-checkbox');
    } else {
      input.classList.add('uk-input', 'uk-form-small');
    }
  }

  return input;
}

function generateSelectOptions (input, options) {
  for (const status of options) {
    const field = document.createElement('option');
    input.appendChild(field);

    field.textContent = status;
  }
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

function createBtn (btnTxt) {
  const button = document.createElement('button');
  button.textContent = btnTxt;
  button.type = 'submit';
  button.classList.add('uk-button', 'uk-button-default');

  return button;
}
