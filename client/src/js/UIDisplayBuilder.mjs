import { createCardDisplay } from './UIGenerator.mjs';
import { createNewEventDisplay } from './UINewEventBuilder.mjs';

function eventDisplay () {
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
  const wrapper = createCardDisplay();

  // TODO: CHECK IF THERE IS EVENTS
  const noEvent = true;

  if (noEvent) {
    wrapper.appendChild(noEventsDisplay());
  } else {
    const film = eventDisplay();
    wrapper.appendChild(film);
  }
}
