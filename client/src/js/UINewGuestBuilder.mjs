import UIkit from 'uikit';
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
      event.preventDefault();

      const elements = newGuestForm.elements;
      const data = JSON.stringify({
        name: elements.Name.value,
        children: elements.Children.checked ? 1 : 0, // 0 = false , 1 = true
        invitationStatus: elements['Invitation status'].value,
        veranstaltungId: this._veranstaltungId
      });

      const response = new ServerCommunications('POST').request('/api/guest', data);
      console.log(response);
      response.then(data => {
        if (data) {
          UIkit.notification('Successful added new guest', 'success', { timeout: 3000 });
        } else {
          UIkit.notification('Failed to add new guest', 'danger', { timeout: 3000 });
        }
        UIGuestListBuilder.initializeGuestList(this._veranstaltungId);
      });
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
