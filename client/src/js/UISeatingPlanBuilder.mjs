import UIkit from 'uikit';
import Resetter from './Resetter.mjs';
import UIGuestListBuilder from './UIGuestListBuilder.mjs';

export default class UISeatingPlanBuilder {
  constructor (guests, veranstalungId) {
    this._numOfTables = 8;
    this._numOfSeatsperTable = 4;
    this._guestList = guests;
    this._tables = this._generateTables();
    this._prevIndex = 0;
    this._veranstalungId = veranstalungId;
  }

  createSeatingPlan () {
    const main = new Resetter().getMain();
    this._seatingPlanWrapper = this._generateWrapper();
    main.appendChild(this._seatingPlanWrapper);

    this._fillSeatingPlanWrapper();
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
    });

    return button;
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
    this._guestOptions = [];
    for (let i = 0; i < this._numOfTables; i++) {
      const table = document.createElement('div');
      table.classList.add('uk-card', 'uk-card-default', 'uk-padding-small');

      // Table Name
      const h3 = document.createElement('h3');
      h3.textContent = `Table ${i + 1}`;
      table.appendChild(h3);

      this._addSeatsperTable(table);

      tables.push(table);
    }

    return tables;
  }

  _addSeatsperTable (table) {
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

    this._guestOptions.push(select);
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

    const selectDropDowns = this._guestOptions.map(x => x.options);
    for (const dropdown of selectDropDowns) {
      if (selectedIndex !== 0) {
        dropdown[selectedIndex].hidden = true;
      }

      if (dropdown[this._prevIndex].hidden) {
        dropdown[this._prevIndex].hidden = false;
      }
    }
  }

  // ONLY FOR EXAMPLE DATASET
  _showGuests (select) {
    for (let i = 0; i < this._guestList.length; i++) {
      const option = document.createElement('option');
      option.textContent = this._guestList[i].name + ` ${i + 1}`;
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
