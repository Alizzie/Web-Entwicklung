import { resetMain } from './UIGenerator.mjs';
import { createNewEventDisplay } from './UINewEventBuilder.mjs';

function createEventDisplay () {
  const wrapper = document.createElement('div');
  wrapper.classList.add('display-event-Wrapper');
  return wrapper;
}

function noEventsDisplay () {
  const wrapper = document.createElement('div');
  wrapper.classList.add('no-Event-Wrapper');

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

export function createMainDisplay () {
  const main = createMainWrapper();

  // TODO: CHECK IF THERE IS EVENTS
  const noEvent = true;

  if (noEvent) {
    main.appendChild(noEventsDisplay());
  } else {
    const film = createEventDisplay();
    main.appendChild(film);
  }
}

export function createMainWrapper () {
  const main = resetMain();
  const classes = ['uk-card', 'uk-card-default', 'uk-card-large', 'uk-width-1-2', 'uk-height-large', 'uk-padding-large', 'uk-card-hover', 'display-Wrapper'];

  for (const newClass of classes) {
    main.classList.add(newClass);
  }

  return main;
}
