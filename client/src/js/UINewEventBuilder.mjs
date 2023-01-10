import UINewGuestBuilder from './UINewGuestBuilder.mjs';
import UICardGenerator from './UIGenerator.mjs';

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

      const elements = Array.from(newEventForm.elements);
      const data = elements.filter(x => x.tagName === 'INPUT').map(x => [x.name, x.value]);
      console.log(data);
      new UINewGuestBuilder().createNewGuestDisplay();
    });
  }
}
