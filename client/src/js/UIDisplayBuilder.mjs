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
  addEventButton.textContent = 'Add new one';
  
  wrapper.appendChild(text);
  wrapper.appendChild(addEventButton);

  addEventButton.addEventListener('click', () => {
    createNewEventDisplay();
  });

  return wrapper;
}

export function createMainDisplay () {
  const main = resetMain();
  main.classList.add('display-Wrapper');
  const noEvent = true;

  if (noEvent) {
    main.appendChild(noEventsDisplay());
  } else {
    const film = createEventDisplay();
    main.appendChild(film);
  }
}
