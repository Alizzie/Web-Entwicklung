import { UIPaginationBuilder, Paginator } from './Pagination.mjs';
import Resetter from './Resetter.mjs';
import ServerCommunications from './ServerRequests.mjs';
import UICardGenerator from './UIGenerator.mjs';
import UINewGuestBuilder from './UINewGuestBuilder.mjs';
import UISeatingPlanBuilder from './UISeatingPlanBuilder.mjs';

export default class UIGuestListBuilder {
  constructor (eventId, guestList) {
    this._guests = guestList;
    this._main = new Resetter().getMain();
    this._tableWrapper = this._generateTableWrapper('guestlist-table');
    this._heading = this._getHeadings();
    this.eventId = eventId;

    this._startPagination();
    this._initializeButtons();
  }

  static async initializeGuestList (eventId) {
    const guests = await new ServerCommunications('GET').request(`/api/guest/${eventId}`);
    new UIGuestListBuilder(eventId, guests).createGuestList();
  }

  createGuestList () {
    this._main.classList.add('display-guestlist');
    this._main.appendChild(this._generateEditButtons());
    this._main.appendChild(this._tableWrapper);

    if (this._guests.length === 0) {
      this._card = new UICardGenerator().getCard();
      this._tableWrapper = this._generateTableWrapper('no-guest-wrapper');
      this._card.appendChild(this._tableWrapper);
      this._noGuestsDisplay();
    } else {
      this._generateTables(0);
      const navigationWrapper = document.createElement('div');
      navigationWrapper.appendChild(this._pagination.getNavigation());
      this._main.appendChild(navigationWrapper);
    }
  }

  callUpdateFunc (nextPage) {
    this._updateTables(nextPage);
  }

  _startPagination () {
    this._tableWidth = 7;
    this._paginatedGuestList = new Paginator(this._guests, this._tableWidth).getPaginatedArray();
    this._maxPages = this._paginatedGuestList.length;

    if (window.innerWidth > 1200) {
      this._maxPages = Math.ceil(this._paginatedGuestList.length / 2);
    }

    this._pagination = new UIPaginationBuilder(this, this._maxPages);
  }

  _generateTableWrapper (className) {
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add(className);
    return tableWrapper;
  }

  _generateEditButtons () {
    const editButtons = document.createElement('div');
    editButtons.classList.add('uk-flex', 'uk-flex-between', 'uk-margin-bottom');

    const modifierWrapper1 = document.createElement('div');
    modifierWrapper1.classList.add('table-buttons');
    modifierWrapper1.appendChild(this._selectAllBtn);
    modifierWrapper1.appendChild(this._delBtn);

    const modifierWrapper2 = document.createElement('div');
    modifierWrapper2.classList.add('table-buttons');
    modifierWrapper2.appendChild(this._seatingBtn);
    modifierWrapper2.appendChild(this._addBtn);

    editButtons.appendChild(modifierWrapper1);
    editButtons.appendChild(modifierWrapper2);

    return editButtons;
  }

  _initializeButtons () {
    this._seatingBtn = this._generateSeatingBtn();
    this._delBtn = this._generateDeleteBtn();
    this._selectAllBtn = this._generateSelectAllBtn();
    this._addBtn = this._generateAddBtn();
  }

  _generateSeatingBtn () {
    const btn = document.createElement('button');
    btn.classList.add('uk-button', 'uk-button-default');
    btn.setAttribute('id', 'seatingBtn');
    btn.textContent = 'Seating Plan';

    btn.addEventListener('click', () => {
      new UISeatingPlanBuilder(this._guests, this.eventId).createSeatingPlan();
    });

    return btn;
  }

  _generateSelectAllBtn () {
    const selectAllBtn = document.createElement('button');
    selectAllBtn.classList.add('uk-button', 'uk-button-default');
    selectAllBtn.setAttribute('id', 'selectAllBtn');
    selectAllBtn.textContent = 'Select All';

    selectAllBtn.addEventListener('click', () => {
      selectAllBtn.classList.toggle('uk-button-default');
      selectAllBtn.classList.toggle('uk-button-secondary');
      this._selectAllCheckboxes(selectAllBtn.classList.contains('uk-button-secondary'));
    });

    return selectAllBtn;
  }

  _selectAllCheckboxes (value) {
    const checkboxes = document.getElementsByClassName('uk-checkbox');
    for (const checkbox of checkboxes) {
      checkbox.checked = value;
    }

    const delBtn = document.getElementById('deleteBtn');
    delBtn.disabled = !value;
  }

  _generateDeleteBtn () {
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('uk-button', 'uk-button-default');
    deleteBtn.setAttribute('disabled', '');
    deleteBtn.setAttribute('id', 'deleteBtn');
    deleteBtn.textContent = 'Delete';

    console.log(this._guests);

    // TODO : Delete Guests from DATABANK AS CLICK EVENT
    deleteBtn.addEventListener('click', () => {
      const checkboxes = Array.from(document.getElementsByClassName('uk-checkbox'));
      const checkedCheckboxes = checkboxes.filter(x => x.checked).map(x => x.id);

      // STEP 2: Send all guest ids to the server
      new ServerCommunications('DELETE').request('/api/guest', JSON.stringify({ guestIds: checkedCheckboxes })).then(
        () => UIGuestListBuilder.initializeGuestList(this.eventId));
    });

    return deleteBtn;
  }

  _generateAddBtn () {
    const addBtn = document.createElement('button');
    addBtn.classList.add('uk-button', 'uk-button-primary');
    addBtn.textContent = 'Add';

    addBtn.addEventListener('click', () => {
      new UINewGuestBuilder(this.eventId).createNewGuestDisplay();
    });

    return addBtn;
  }

  _generateTables (pagTableIndex) {
    let start = pagTableIndex;
    let end = start;

    if (window.innerWidth > 1200) {
      start = start * 2;
      end = end + 1;
    }

    for (let i = start; i <= end; i++) {
      const tableGuests = this._paginatedGuestList[i];

      if (!tableGuests) {
        break;
      }

      const tableWrapper = document.createElement('div');
      tableWrapper.classList.add('table', 'uk-width-1-2@l');
      this._tableWrapper.appendChild(tableWrapper);

      const guestListTable = document.createElement('table');
      guestListTable.classList.add('uk-table', 'uk-table-hover', 'uk-table-small', 'uk-table-divider', 'uk-table-striped');
      tableWrapper.appendChild(guestListTable);

      guestListTable.appendChild(this._generateTableHead());
      guestListTable.appendChild(this._generateTableBody(tableGuests));
    }
  }

  _noGuestsDisplay () {
    const text = document.createElement('h1');
    text.textContent = 'No Guests';

    const addEventButton = document.createElement('button');
    addEventButton.classList.add('uk-button', 'uk-button-secondary');
    addEventButton.textContent = 'Add first Guest';

    this._tableWrapper.appendChild(text);
    this._tableWrapper.appendChild(addEventButton);

    addEventButton.addEventListener('click', () => {
      new UINewGuestBuilder(this.eventId).createNewGuestDisplay();
    });
  }

  _updateTables (page) {
    const table = document.getElementsByClassName('guestlist-table')[0];
    table.innerHTML = '';
    this._generateTables(page);

    if (this._selectAllBtn.classList.contains('uk-button-default')) {
      this._delBtn.disabled = true;
    }
  }

  _generateTableHead () {
    const head = document.createElement('thead');
    const headRow = document.createElement('tr');
    head.appendChild(headRow);

    // Elements
    for (const header of this._heading) {
      const text = document.createElement('th');
      text.classList.add(header.class);
      text.textContent = header.name;

      headRow.appendChild(text);
    }

    return head;
  }

  _generateTableBody (guests) {
    const tableBody = document.createElement('tbody');

    for (const guest of guests) {
      const row = document.createElement('tr');
      tableBody.appendChild(row);

      console.log(guest);

      row.appendChild(this._generateCheckboxCell(guest.guest_id));
      row.appendChild(this._generateGuestName(guest.name));
      row.appendChild(this._generateStatus(guest.invitation_status));
      row.appendChild(this._generateChildren(guest.child));
      row.appendChild(this._generateModifier());
    }

    return tableBody;
  }

  _generateCheckboxCell (guestId) {
    const checkboxCell = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.classList.add('uk-checkbox');
    checkbox.type = 'checkbox';
    checkbox.ariaLabel = 'Checkbox';
    checkboxCell.appendChild(checkbox);
    checkbox.id = guestId;

    if (this._selectAllBtn.classList.contains('uk-button-secondary')) {
      checkbox.checked = true;
    }

    this._selectCheckboxes(checkbox);

    return checkboxCell;
  }

  _selectCheckboxes (checkbox) {
    checkbox.addEventListener('change', () => {
      const checkboxes = Array.from(document.getElementsByClassName('uk-checkbox'));

      if (checkboxes.map(x => x.checked).includes(true)) {
        this._delBtn.disabled = false;
      } else {
        this._delBtn.disabled = true;
      }
    });
  }

  _generateGuestName (name) {
    const nameCell = document.createElement('td');
    nameCell.classList.add('uk-table-link');
    const guestName = document.createElement('a');
    guestName.classList.add('uk-link-reset');
    guestName.textContent = name;
    nameCell.appendChild(guestName);

    return nameCell;
  }

  _generateStatus (status) {
    const statusCell = document.createElement('td');
    statusCell.classList.add('uk-text-truncate');
    statusCell.textContent = status;

    return statusCell;
  }

  _generateChildren (children) {
    const childrenCell = document.createElement('td');
    childrenCell.classList.add('uk-text-truncate');

    if (children === 1) {
      childrenCell.textContent = 'Yes';
    }

    if (children === 0) {
      childrenCell.textContent = 'No';
    }

    return childrenCell;
  }

  _generateModifier () {
    const modifierCell = document.createElement('td');
    const plusImage = document.createElement('img');
    plusImage.classList.add('uk-preserve-width');
    plusImage.src = 'images/plus.png';
    plusImage.width = '16';
    plusImage.height = '16';
    modifierCell.appendChild(plusImage);

    modifierCell.addEventListener('click', () => {
      const guestData = Array.from(modifierCell.parentNode.cells).filter(x => x.classList.length !== 0)
        .map(x => x.textContent);
      new UINewGuestBuilder().editGuest(guestData);
    });

    return modifierCell;
  }

  _getHeadings () {
    const headings = [
      {
        name: '',
        class: 'uk-table-shrink'
      }, {
        name: 'Guest Name',
        class: 'uk-table-expand'
      }, {
        name: 'Status',
        class: 'uk-width-small'
      }, {
        name: 'Children',
        class: 'uk-width-small'
      }, {
        name: 'Edit',
        class: 'uk-table-shrink'
      }
    ];

    return headings;
  }
}
