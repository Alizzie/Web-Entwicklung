import UINewGuestBuilder from './UINewGuestBuilder.mjs';
import UICardGenerator from './UIGenerator.mjs';
import ServerCommunications from './ServerRequests.mjs';
import UIkit from 'uikit';

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
    name: 'Rectangular tables',
    type: 'number',
    placeholder: '0',
    min: '0'
  },
  {
    name: 'Seats per table',
    type: 'number',
    placeholder: '0',
    min: '0'

  },
  {
    name: 'Both sides',
    type: 'checkbox'
  }
];

export default class UINewEventBuilder {
  constructor () {
    // Heading and Class Name
    this._heading = 'Creating new Event';
    this._cName = 'creation-new-event';

    // Button properties
    this._btnText = 'Continue to Guest List';

    // Params
    this._eParams = [eventAttributes, 'creation-event-attr', 'Event Parameters'];
    this._sParams = [seatsPlanAttributes, 'creation-seating-attr', 'Seating Parameters'];

    this._cardGenerator = new UICardGenerator();
  }

  createNewEventDisplay () {
    this._cardGenerator.formularCardConstructor(this._heading, this._cName, this._btnText, [this._eParams, this._sParams]);
    this._cardGenerator.createCardFormularDisplay();
    this._addEvent();
  }

  _addEvent () {
    const newEventForm = this._cardGenerator.getFormular();
    newEventForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const elements = newEventForm.elements;
      const data = JSON.stringify({
        name: elements['Event Name'].value,
        date: elements.Date.value,
        time: elements.Time.value,
        countTables: elements['Rectangular tables'].value,
        countTableSeats: elements['Seats per table'].value,
        useBothSides: elements['Both sides'].checked ? 1 : 0
      });

      const response = new ServerCommunications('POST').request('/api/events', data);
      if (response) {
        UIkit.notification('Successful created new Event', 'success', { timeout: 3000 });
      } else {
        UIkit.notification('Failed to create Event', 'danger', { timeout: 3000 });
      }
      new UINewGuestBuilder().createNewGuestDisplay();
    });
  }
}
