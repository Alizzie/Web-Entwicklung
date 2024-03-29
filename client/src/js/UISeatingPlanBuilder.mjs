import UIkit from 'uikit';
import Resetter from './Resetter.mjs';
import ServerCommunications from './ServerRequests.mjs';
import UIGuestListBuilder from './UIGuestListBuilder.mjs';

export default class UISeatingPlanBuilder {
  constructor (guests, veranstalungId, seatingPlanInfo, seatingPlanData) {
    this._guestList = guests;
    this._veranstalungId = veranstalungId;
    this._seatingPlanData = seatingPlanData;
    this._numOfTables = seatingPlanInfo.countTables;
    this._numOfSeatsperTable = seatingPlanInfo.seatsPerTable;

    this._tables = this._generateTables();
    this._prevIndex = 0;
  }

  static async initializeSeatingPlan (guests, veranstaltungId) {
    const seatingPlanInfo = await new ServerCommunications('GET').get(`api/desk/tableNumbers/${veranstaltungId}`);
    const seatingPlanData = await new ServerCommunications().request(`/api/desk/${veranstaltungId}`);

    new UISeatingPlanBuilder(guests, veranstaltungId, seatingPlanInfo, seatingPlanData).createSeatingPlan();
  }

  createSeatingPlan () {
    const main = new Resetter().getMain();
    this._seatingPlanWrapper = this._generateWrapper();
    main.appendChild(this._seatingPlanWrapper);

    this._fillSeatingPlanWrapper();
    this._fillExisitingSeatingPlan();
  }

  _generateWrapper () {
    const wrapper = document.createElement('div');
    wrapper.classList.add('seating-plan');
    return wrapper;
  }

  _fillSeatingPlanWrapper () {
    this._seatingPlanWrapper.appendChild(this._addBtns());
    this._seatingPlanWrapper.appendChild(this._generateSeatingTables());
  }

  _addBtns () {
    const buttonWrapper = document.createElement('div');
    buttonWrapper.classList.add('uk-flex', 'uk-flex-right');
    buttonWrapper.appendChild(this._backGuestlistBtn());
    buttonWrapper.appendChild(this._saveAllBtn());

    return buttonWrapper;
  }

  _saveAllBtn () {
    const button = document.createElement('button');
    button.classList.add('uk-button', 'uk-button-primary');
    button.textContent = 'Save';

    button.addEventListener('click', () => {
      UIkit.notification('Seating Plan saved', 'success', { timeout: 3000 });
      this._sendSeatingPlanData();
    });

    return button;
  }

  _sendSeatingPlanData () {
    const arr = Array.from(document.getElementsByTagName('select'));
    const selectedGuestIndeces = arr.map(x => x.options.selectedIndex - 1);
    const guestIds = [];

    selectedGuestIndeces.forEach(i => {
      if (i === -1) {
        guestIds.push(null);
      } else {
        guestIds.push(this._guestList[i].guest_id);
      }
    });

    const data = JSON.stringify({
      veranstaltungId: this._veranstalungId,
      numOfTables: this._numOfTables,
      numOfSeatsperTable: this._numOfSeatsperTable,
      guestIdAtTable: guestIds
    });
    new ServerCommunications('POST').request('/api/desk', data);
  }

  _fillExisitingSeatingPlan () {
    this._seatingPlanData.forEach(i => {
      if (i.name) {
        const tablePos = i.guestPosition + i.deskIndex * this._numOfSeatsperTable;
        this._guestSelects[tablePos].value = i.name;

        const selectedIndex = this._guestSelects[tablePos].options.selectedIndex;

        const selectDropDowns = this._guestSelects.map(x => x.options);
        for (const dropdown of selectDropDowns) {
          dropdown[selectedIndex].hidden = true;
        }
      }
    });
  }

  _backGuestlistBtn () {
    const button = document.createElement('button');
    button.classList.add('uk-button', 'uk-button-default');
    button.textContent = 'Guest List';

    button.addEventListener('click', () => {
      UIGuestListBuilder.initializeGuestList(this._veranstalungId);
    });

    return button;
  }

  _generateSeatingTables () {
    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('guest-tables-wrapper');

    for (const table of this._tables) {
      tableWrapper.appendChild(table);
    }

    return tableWrapper;
  }

  _generateTables () {
    const tables = [];
    this._guestSelects = [];
    for (let tableIndex = 0; tableIndex < this._numOfTables; tableIndex++) {
      const table = document.createElement('div');
      table.classList.add('uk-card', 'uk-card-default', 'uk-padding-small');

      // Table Name
      const h3 = document.createElement('h3');
      h3.textContent = `Table ${tableIndex + 1}`;
      table.appendChild(h3);

      this._addSeatsperTable(table, tableIndex);

      tables.push(table);
    }

    return tables;
  }

  _addSeatsperTable (table, tableIndex) {
    for (let j = 0; j < this._numOfSeatsperTable; j++) {
      const seat = document.createElement('div');
      seat.classList.add('guest-table');
      seat.setAttribute('uk-form-custom', 'target: > * > span:first-child');

      seat.appendChild(this._fillSelectOptions(`Select Guest ${j + 1}`));

      seat.appendChild(this._addButtonVisuality());
      table.appendChild(seat);
    }
  }

  _fillSelectOptions (optionText) {
    const select = document.createElement('select');
    select.ariaLabel = 'Custom controls';

    const emptyOption = document.createElement('option');
    emptyOption.textContent = optionText;
    select.appendChild(emptyOption);
    this._showGuests(select);

    this._addEventsToSelect(select);

    this._guestSelects.push(select);
    return select;
  }

  _addEventsToSelect (select) {
    select.addEventListener('click', () => {
      this._prevIndex = select.options.selectedIndex;
    });

    select.addEventListener('change', (event) => {
      this._changeChooseableGuest(event);
    });
  }

  _changeChooseableGuest (event) {
    const select = event.target;
    const selectedIndex = select.options.selectedIndex;

    const selectDropDowns = this._guestSelects.map(x => x.options);
    for (const dropdown of selectDropDowns) {
      if (selectedIndex !== 0) {
        dropdown[selectedIndex].hidden = true;
      }

      if (dropdown[this._prevIndex].hidden) {
        dropdown[this._prevIndex].hidden = false;
      }
    }
  }

  _showGuests (select) {
    for (let i = 0; i < this._guestList.length; i++) {
      const option = document.createElement('option');
      option.textContent = this._guestList[i].name;
      select.appendChild(option);
    }
  }

  _addButtonVisuality () {
    const button = document.createElement('button');
    button.classList.add('uk-button', 'uk-button-default');
    button.type = 'button';

    const span = document.createElement('span');
    button.appendChild(span);

    return button;
  }
}
