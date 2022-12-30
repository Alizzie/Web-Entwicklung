import { createCardDisplay, resetMain } from './UIGenerator.mjs';
import { createNewEventDisplay } from './UINewEventBuilder.mjs';

const events = [
  {
    name: 'Event 1',
    date: '2020-02-02',
    time: '12:09'
  },
  {
    name: 'Event 2',
    date: '2020-02-2002',
    time: '12:09'
  },
  {
    name: 'Event 3',
    date: '2020-02-2002',
    time: '12:09'
  },
  {
    name: 'Event 4',
    date: '2020-02-2002',
    time: '12:09'
  },
  {
    name: 'Event 5',
    date: '2020-02-2002',
    time: '12:09'
  }
];

// MAIN DISPLAY FUNCTION
export function createMainDisplay () {
  // TODO: CHECK IF THERE IS EVENTS
  const noEvent = true;
  // ==============================
  if (noEvent) {
    const wrapper = createCardDisplay();
    wrapper.appendChild(noEventsDisplay());
  } else {
    console.log('EVENTS');
    const main = resetMain();
    main.appendChild(generateAddBtn());
    main.appendChild(eventDisplay());
  }
}

// DISPLAY WHEN NO EVENT EXISTS
function noEventsDisplay () {
  const wrapper = document.createElement('div');
  wrapper.classList.add('no-event-wrapper');

  const text = document.createElement('h1');
  text.textContent = 'No Events created';

  const addEventButton = document.createElement('button');
  addEventButton.classList.add('uk-button', 'uk-button-secondary');
  addEventButton.textContent = 'Add new one';

  wrapper.appendChild(text);
  wrapper.appendChild(addEventButton);

  addEventButton.addEventListener('click', () => {
    createNewEventDisplay();
  });

  return wrapper;
}

// DISPLAY WHEN EVENT EXISTS
function eventDisplay () {
  const wrapper = document.createElement('div');
  wrapper.classList.add('display-event-wrapper');

  // ITERATE THROUGH ALL EVENTS IN DATABASE
  for (const e of events) {
    wrapper.appendChild(createEventBlock(e));
  }

  return wrapper;
}

function createEventBlock (params) {
  const div = document.createElement('div');
  div.classList.add('uk-card', 'uk-card-default', 'event-card');

  div.appendChild(createEditBtnInsideEventCard());

  const h3 = document.createElement('h3');
  h3.classList.add('uk-card-title', 'uk-margin-remove-bottom');
  h3.textContent = params.name;
  div.appendChild(h3);

  const p = document.createElement('p');
  p.classList.add('uk-text-meta', 'uk-margin-remove-top');
  p.textContent = params.date + ', ' + params.time;
  div.appendChild(p);

  return div;
}

function createEditBtnInsideEventCard () {
  const div = document.createElement('div');
  div.classList.add('edit-buttons-card-inside');

  div.appendChild(generateDeleteBtn());
  div.appendChild(generateEditBtn());

  return div;
}

function generateDeleteBtn () {
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('uk-button', 'uk-button-default');
  deleteBtn.setAttribute('id', 'deleteBtn');
  deleteBtn.textContent = 'Delete';

  // TODO : Delete Guests from DATABANK AS CLICK EVENT

  return deleteBtn;
}

function generateEditBtn () {
  const editBtn = document.createElement('button');
  editBtn.classList.add('uk-button', 'uk-button-primary');
  editBtn.setAttribute('id', 'editBtn');
  editBtn.textContent = 'Edit';

  return editBtn;
}

function generateAddBtn () {
  const div = document.createElement('div');
  div.classList.add('uk-flex', 'uk-flex-center');

  const addBtn = document.createElement('button');
  addBtn.classList.add('uk-button', 'uk-button-default');
  addBtn.textContent = 'Create Event';

  div.appendChild(addBtn);

  return div;
}
