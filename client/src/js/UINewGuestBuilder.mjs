import UICardGenerator from './UIGenerator.mjs';
import UIGuestListBuilder from './UIGuestListBuilder.mjs';

export default class UINewGuestBuilder {
  constructor () {
    this._heading = 'Add new Guest';
    this._cName = 'creation-newGuest';
    this._btnText = 'Add Guest';

    this._guestAttributes = this._guestParams();

    this._gParams = [[this._guestAttributes, 'creation-guest-attr', 'Guest Parameters']];

    this._cardGenerator = new UICardGenerator();
  }

  // NEW GUEST
  createNewGuestDisplay () {
    this._cardGenerator.formularCardConstructor(this._heading, this._cName, this._btnText, this._gParams);
    this._cardGenerator.createCardFormularDisplay();
    this._addEvent();
  }

  // EDIT EXISITNG GUEST
  editGuest (guestData) {
    this._heading = 'Edit Guest';
    this._btnText = 'Save Guest';
    this.createNewGuestDisplay();
    this._fillGuestData(guestData);
  }

  _fillGuestData (guestData) {
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
    const newEventForm = this._cardGenerator.getFormular();
    newEventForm.addEventListener('submit', (event) => {
      event.preventDefault();

      // const elements = Array.from(newEventForm.elements);
      // const data = elements.filter(x => x.tagName === 'INPUT' || x.tagName === 'SELECT').map(x => [x.name, x.value]);
      new UIGuestListBuilder().createGuestList();
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
