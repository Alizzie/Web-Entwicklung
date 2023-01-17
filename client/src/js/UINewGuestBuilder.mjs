import ServerCommunications from './ServerRequests.mjs';
import UICardGenerator from './UIGenerator.mjs';
import UIGuestListBuilder from './UIGuestListBuilder.mjs';

export default class UINewGuestBuilder {
  constructor (veranstaltungId) {
    this._heading = 'Add new Guest';
    this._cName = 'creation-newGuest';
    this._btnText = 'Add Guest';
    this._guestAttributes = this._guestParams();

    this._gParams = [[this._guestAttributes, 'creation-guest-attr', 'Guest Parameters']];

    this._cardGenerator = new UICardGenerator();
    this._veranstaltungId = veranstaltungId;
  }

  // EVERY GUEST BELONGS TO A GUEST LIST, A GUEST LIST BELONGS TO AN EVENT
  // ONLY THE EVENT_ID IS NEEDED TO GET EVERY ALL OTHER IDS e.g. ( GUESTLIST_ID, GUEST_ID, ...)
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

  _addEvent () { // _addGuest?
    const newGuestForm = this._cardGenerator.getFormular();
    newGuestForm.addEventListener('submit', (event) => {
      const elements = newGuestForm.elements;
      event.preventDefault();
      // Data from Formular needed
      const data = JSON.stringify({
        name: elements[1].value,
        children: elements[2].value, // 0 = false , 1 = true
        invitationStatus: elements[3].value,
        veranstaltungId: this._veranstaltungId
      });
      console.log(this._veranstaltungId);
      console.log(data);

      // const response = new ServerCommunications('POST').request('/api/events', data);
      // const elements = Array.from(newGuestForm.elements);
      // const data = elements.filter(x => x.tagName === 'INPUT' || x.tagName === 'SELECT').map(x => [x.name, x.value]);
      new ServerCommunications('POST').request('/api/guest', data);
      UIGuestListBuilder.initializeGuestList(this._veranstaltungId);
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
