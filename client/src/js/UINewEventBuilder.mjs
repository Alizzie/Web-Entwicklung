import { createCardFormularDisplay } from './UIGenerator.mjs';
import UINewGuestBuilder from './UINewGuestBuilder.mjs';

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
  // Heading and Class Name
  const heading = 'Creating new Event';
  const cName = 'creation-newEvent';

  // Button properties
  const btnText = 'Continue to Guest List';

  // Params
  const eParams = [eventAttributes, 'creation-eventAttr', 'Event Parameters'];
  const sParams = [seatsPlanAttributes, 'creation-seatingAttr', 'Seating Parameters'];

  createCardFormularDisplay(heading, cName, btnText, [eParams, sParams]);
  addEvent();
}

// NEW EVENT FORMULAR EVENT LISTENER
function addEvent () {
  const newEventForm = document.getElementById('formular');
  const port = window.location.port;
  newEventForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const elements = Array.from(newEventForm.elements);
    const data = elements.filter(x => x.tagName === 'INPUT').map(x => [x.name, x.value]);

    fetch(`http://localhost:${port}/api/newEvent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then(res => {
      return res.text();
    }).then(data => {
      new UINewGuestBuilder().createNewGuestDisplay();
    }).catch(error => console.log(error));
  });
}
