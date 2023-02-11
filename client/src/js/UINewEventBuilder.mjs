
import UICardGenerator from './UIGenerator.mjs';
import ServerCommunications from './ServerRequests.mjs';
import UIkit from 'uikit';
import UIGuestListBuilder from './UIGuestListBuilder.mjs';

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
    min: '0',
    max: '100'
  },
  {
    name: 'Seats per table',
    type: 'number',
    placeholder: '0',
    min: '0',
    max: '8'

  },
  {
    name: 'Both sides',
    type: 'checkbox'
  }
];

export default class UINewEventBuilder {
  constructor () {
    // Heading and Class Name
    this._heading = 'Create new Event';
    this._cName = 'creation-new-event';

    // Button properties
    this._btnText = 'Continue to Guest List';

    // Params
    this._eParams = [eventAttributes, 'creation-event-attr', 'Event Information'];
    this._sParams = [seatsPlanAttributes, 'creation-seating-attr', 'Seating Plan Information'];

    this._cardGenerator = new UICardGenerator();
  }

  createNewEventDisplay () {
    this._cardGenerator.formularCardConstructor(this._heading, this._cName, this._btnText, [this._eParams, this._sParams]);
    this._cardGenerator.createCardFormularDisplay();
    this._addEvent();
  }

  _addEvent () {
    const newEventForm = this._cardGenerator.getFormular();
    const elements = newEventForm.elements;

    newEventForm.addEventListener('submit', (event) => {
      event.preventDefault();

      if (new Date() > new Date(elements.Date.value)) {
        UIkit.notification('the date is out of date', 'danger', { timeout: 3000 });
        return;
      }

      const data = JSON.stringify({
        name: elements['Event Name'].value,
        date: elements.Date.value,
        time: elements.Time.value,
        countTables: elements['Rectangular tables'].value,
        countTableSeats: elements['Seats per table'].value,
        useBothSides: elements['Both sides'].checked ? 2 : 1
      });

      const response = new ServerCommunications('POST').request('/api/events', data);
      response.then(data => {
        if (data) {
          UIkit.notification('Event successful created', 'success', { timeout: 3000 });
        } else {
          UIkit.notification('Failed to create event', 'danger', { timeout: 3000 });
        }
        UIGuestListBuilder.initializeGuestList(data.veranstaltung_id);
      });
    });
  }
}
