import { UIPaginationBuilder, Paginator } from './Pagination.mjs';
import { resetMain } from './UIGenerator.mjs';
import UINewGuestBuilder from './UINewGuestBuilder.mjs';

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

const guestsList = [
];

// TODO: Variable variiert nach Window Size Groeße
const tableSize = 7;

export function createGuestList () {
  // WITHOUT DATABASE RANDOM NUMBERS OF GUESTS
  for (let i = 0; i < Math.random() * 1000; i++) {
    guestsList.push({
      name: 'Elisa Du',
      status: 'invited',
      children: '0'
    });
  }

  const main = resetMain();

  main.appendChild(generateEditButtons());

  const tableWrapper = document.createElement('div');
  tableWrapper.classList.add('guestListTable');
  generateTables(tableWrapper, 0);
  main.appendChild(tableWrapper);

  const paginatedGuestList = new Paginator(guestsList, tableSize).getPaginatedArray();
  const maxPages = Math.ceil(paginatedGuestList.length / 2);
  const navigationWrapper = document.createElement('div');

  const pagination = new UIPaginationBuilder(updateTables, maxPages);
  navigationWrapper.appendChild(pagination.getNavigation());
  main.appendChild(navigationWrapper);
}

function generateEditButtons () {
  const editButtons = document.createElement('div');
  editButtons.classList.add('uk-flex', 'uk-flex-between', 'uk-margin-bottom');

  const modifierWrapper1 = document.createElement('div');
  modifierWrapper1.appendChild(generateSelectAllBtn());
  modifierWrapper1.appendChild(generateDeleteBtn());

  const modifierWrapper2 = document.createElement('div');
  modifierWrapper2.appendChild(generateSeatingBtn());
  modifierWrapper2.appendChild(generateAddBtn());

  editButtons.appendChild(modifierWrapper1);
  editButtons.appendChild(modifierWrapper2);

  return editButtons;
}

function generateSeatingBtn () {
  const btn = document.createElement('button');
  btn.classList.add('uk-button', 'uk-button-default');
  btn.setAttribute('id', 'seatingBtn');
  btn.textContent = 'Seating Plan';

  btn.addEventListener('click', () => {
    // ROUTE TO SEATING PLAN PAGE
    console.log('Go to Seating Plan');
  });

  return btn;
}

function generateSelectAllBtn () {
  const selectAllBtn = document.createElement('button');
  selectAllBtn.classList.add('uk-button', 'uk-button-default');
  selectAllBtn.setAttribute('id', 'selectAllBtn');
  selectAllBtn.textContent = 'Select All';

  selectAllBtn.addEventListener('click', () => {
    selectAllBtn.classList.toggle('uk-button-default');
    selectAllBtn.classList.toggle('uk-button-secondary');
    selectAllCheckboxes(selectAllBtn.classList.contains('uk-button-secondary'));
  });

  return selectAllBtn;
}

function selectAllCheckboxes (value) {
  const checkboxes = document.getElementsByClassName('uk-checkbox');
  for (const checkbox of checkboxes) {
    checkbox.checked = value;
  }

  const delBtn = document.getElementById('deleteBtn');
  delBtn.disabled = !value;
}

function generateDeleteBtn () {
  const deleteBtn = document.createElement('button');
  deleteBtn.classList.add('uk-button', 'uk-button-default');
  deleteBtn.setAttribute('disabled', '');
  deleteBtn.setAttribute('id', 'deleteBtn');
  deleteBtn.textContent = 'Delete';

  // TODO : Delete Guests from DATABANK AS CLICK EVENT

  return deleteBtn;
}

function generateAddBtn () {
  const addBtn = document.createElement('button');
  addBtn.classList.add('uk-button', 'uk-button-primary');
  addBtn.textContent = 'Add';

  // TODO: CREATE ADD GUEST FORMULAR AS CLICK EVENT
  addBtn.addEventListener('click', () => {
    new UINewGuestBuilder().createNewGuestDisplay();
  });

  return addBtn;
}

// Create Two Tables When more Guests than 6!
// Pagination guestList with only 6 -> save all tables in array
// Per Side only two tables next to each other
function generateTables (outsideWrapper, pagTableIndex) {
  const guestArr = new Paginator(guestsList, tableSize).getPaginatedArray();

  const start = pagTableIndex * 2;
  const end = start + 1;
  for (let i = start; i <= end; i++) {
    const tableGuests = guestArr[i];

    if (!tableGuests) {
      break;
    }

    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('uk-table-responsive', 'uk-width-1-2');
    outsideWrapper.appendChild(tableWrapper);

    const guestListTable = document.createElement('table');
    guestListTable.classList.add('uk-table', 'uk-table-hover', 'uk-table-small', 'uk-table-divider', 'uk-table-striped');
    tableWrapper.appendChild(guestListTable);

    guestListTable.appendChild(generateTableHead());
    guestListTable.appendChild(generateTableBody(tableGuests));
  }
}

const updateTables = function (page) {
  const table = document.getElementsByClassName('guestListTable')[0];
  table.innerHTML = '';
  generateTables(table, page);

  if (document.getElementById('selectAllBtn').classList.contains('uk-button-default')) {
    const delBtn = document.getElementById('deleteBtn');
    delBtn.disabled = true;
  }
};

function generateTableHead () {
  const head = document.createElement('thead');
  const headRow = document.createElement('tr');
  head.appendChild(headRow);

  // Elements
  for (const header of headings) {
    const text = document.createElement('th');
    text.classList.add(header.class);
    text.textContent = header.name;

    headRow.appendChild(text);
  }

  return head;
}

function generateTableBody (guests) {
  const tableBody = document.createElement('tbody');

  for (const guest of guests) {
    const row = document.createElement('tr');
    tableBody.appendChild(row);

    row.appendChild(generateCheckboxCell());
    row.appendChild(generateGuestName(guest.name));
    row.appendChild(generateStatus(guest.status));
    row.appendChild(generateChildren(guest.children));
    row.appendChild(generateModifier());
  }

  return tableBody;
}

function generateCheckboxCell () {
  const checkboxCell = document.createElement('td');
  const checkbox = document.createElement('input');
  checkbox.classList.add('uk-checkbox');
  checkbox.type = 'checkbox';
  checkbox.ariaLabel = 'Checkbox';
  checkboxCell.appendChild(checkbox);

  const selectAllBtn = document.getElementById('selectAllBtn');
  if (selectAllBtn.classList.contains('uk-button-secondary')) {
    checkbox.checked = true;
  }

  selectCheckboxes(checkbox);

  return checkboxCell;
}

function selectCheckboxes (checkbox) {
  const delBtn = document.getElementById('deleteBtn');
  checkbox.addEventListener('change', () => {
    const checkboxes = Array.from(document.getElementsByClassName('uk-checkbox'));

    if (checkboxes.map(x => x.checked).includes(true)) {
      delBtn.disabled = false;
    } else {
      delBtn.disabled = true;
    }
  });
}

function generateGuestName (name) {
  const nameCell = document.createElement('td');
  nameCell.classList.add('uk-table-link');
  const guestName = document.createElement('a');
  guestName.classList.add('uk-link-reset');
  guestName.textContent = name;
  nameCell.appendChild(guestName);

  return nameCell;
}

function generateStatus (status) {
  const statusCell = document.createElement('td');
  statusCell.classList.add('uk-text-truncate');
  statusCell.textContent = status;

  return statusCell;
}

function generateChildren (children) {
  const childrenCell = document.createElement('td');
  childrenCell.classList.add('uk-text-truncate');

  if (children === '1') {
    childrenCell.textContent = 'Yes';
  }

  if (children === '0') {
    childrenCell.textContent = 'No';
  }

  return childrenCell;
}

function generateModifier () {
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
