import { createCardFormularDisplay } from './UIGenerator.mjs';
import { createGuestList } from './UIGuestListBuilder.mjs';

export default class UINewGuestBuilder {
  constructor () {
    this.heading = 'Add new Guest';
    this.cName = 'creation-newGuest';
    this.btnText = 'Add Guest';

    this.guestAttributes = this._guestParams();

    this.gParams = [[this.guestAttributes, 'creation-guestAttr', 'Guest Parameters']];
  }

  // NEW GUEST
  createNewGuestDisplay () {
    createCardFormularDisplay(this.heading, this.cName, this.btnText, this.gParams);
    this._addEvent();
  }

  // EDIT EXISITNG GUEST
  editGuest (guestData) {
    this.heading = 'Edit Guest';
    this.btnText = 'Save Guest';
    this.createNewGuestDisplay();
    this._fillGuestData(guestData);
  }

  _fillGuestData (guestData) {
    console.log(guestData);
    const [guestName, guestStatus, children] = guestData;

    const inputs = document.getElementsByTagName('input');
    inputs.Name.value = guestName;

    if (children === 'No') {
      inputs.Children.checked = 0;
    } else {
      inputs.Children.checked = 1;
    }

    const select = document.getElementsByTagName('select')[0];
    select.value = guestStatus;
  }

  _addEvent () {
    const newEventForm = document.getElementById('formular');
    const port = window.location.port;
    newEventForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const elements = Array.from(newEventForm.elements);
      const data = elements.filter(x => x.tagName === 'INPUT' || x.tagName === 'SELECT').map(x => [x.name, x.value]);

      fetch(`http://localhost:${port}/api/newGuest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then(res => {
        return res.text();
      }).then(data => {
        const result = JSON.parse(data);
        console.log(result);
        createGuestList();
      }).catch(error => console.log(error));
    });
  }

  _guestParams () {
    return [
      {
        name: 'Name',
        type: 'text',
        placeholder: 'Guest Name'
      },
      {
        name: 'Children',
        type: 'checkbox'
      },
      {
        name: 'Invitation status',
        type: 'select',
        options: ['unknown', 'invited', 'accepted', 'declined']
      }
    ];
  }
}
