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
  {
    name: 'Elisa Du1',
    status: 'Eingeladen',
    children: '0'
  },
  {
    name: 'Elisa Du2',
    status: 'Eingeladen',
    children: '0'
  },
  {
    name: 'Elisa Du3',
    status: 'invited',
    children: '0'
  },
  {
    name: 'Elisa Du4',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du5',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Aliiziee Du6',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du7',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du8',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du9',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du10',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du11',
    status: 'Eingeladen',
    children: '1'
  }, {
    name: 'Elisa Du12',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du13',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du10',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du11',
    status: 'Eingeladen',
    children: '1'
  }, {
    name: 'Elisa Du12',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du13',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du10',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du11',
    status: 'Eingeladen',
    children: '1'
  }, {
    name: 'Elisa Du12',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du13',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du10',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du11',
    status: 'Eingeladen',
    children: '1'
  }, {
    name: 'Elisa Du12',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du13',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du10',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du11',
    status: 'Eingeladen',
    children: '1'
  }, {
    name: 'Elisa Du12',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du13',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du10',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du11',
    status: 'Eingeladen',
    children: '1'
  }, {
    name: 'Elisa Du12',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du13',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du10',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du11',
    status: 'Eingeladen',
    children: '1'
  }, {
    name: 'Elisa Du12',
    status: 'Eingeladen',
    children: '1'
  },
  {
    name: 'Elisa Du13',
    status: 'Eingeladen',
    children: '1'
  }
];

// TODO: Variable variiert nach Window Size Groeße
const tableSize = 7;

const paginatedGuestList = async () => {
  return paginateGuestList(guestsList, tableSize);
};

// Data Splitting into Arrays of each 6 elements
function paginateGuestList (array, tableSize) {
  const maxPages = Math.ceil(guestsList.length / tableSize);
  return Array.from({ length: maxPages }, (_, i) => {
    const start = i * tableSize;
    return array.slice(start, start + tableSize);
  });
}

export async function createGuestList () {
  const main = resetMain();

  main.appendChild(generateEditButtons());

  const tableWrapper = document.createElement('div');
  tableWrapper.classList.add('guestListTable');
  generateTables(tableWrapper, 0);
  main.appendChild(tableWrapper);

  const maxPages = Math.ceil((await paginatedGuestList()).length / 2);
  const navigationWrapper = document.createElement('div');
  navigationWrapper.appendChild(generatePagNavigation(maxPages));
  main.appendChild(navigationWrapper);
}

function generateEditButtons () {
  const editButtons = document.createElement('div');
  editButtons.classList.add('uk-flex', 'uk-flex-between', 'uk-margin-bottom');

  const modifierWrapper = document.createElement('div');
  modifierWrapper.appendChild(generateSelectAllBtn());
  modifierWrapper.appendChild(generateDeleteBtn());
  editButtons.appendChild(modifierWrapper);

  editButtons.appendChild(generateAddBtn());

  return editButtons;
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
  addBtn.addEventListener('click', (event) => {
    new UINewGuestBuilder().createNewGuestDisplay();
  });

  return addBtn;
}

// TODO Create Two Tables When more Guests than 6!
// Pagination guestList with only 6 -> save all tables in array
// Per Side only two tables next to each other
async function generateTables (outsideWrapper, pagTableIndex) {
  const guestArr = await paginatedGuestList();

  const start = pagTableIndex * 2;
  const end = start + 1;
  for (let i = start; i <= end; i++) {
    const tableGuests = guestArr[i];

    if (!tableGuests) {
      break;
    }

    const tableWrapper = document.createElement('div');
    tableWrapper.classList.add('uk-table-responsive', 'uk-width-1-2', 'uk-margin-bottom');
    outsideWrapper.appendChild(tableWrapper);

    const guestListTable = document.createElement('table');
    guestListTable.classList.add('uk-table', 'uk-table-hover', 'uk-table-small', 'uk-table-divider', 'uk-table-striped');
    tableWrapper.appendChild(guestListTable);

    guestListTable.appendChild(generateTableHead());
    guestListTable.appendChild(generateTableBody(tableGuests));
  }
}

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

    row.addEventListener('click', (event) => {
      const guestData = Array.from(row.cells).filter(x => x.classList.length !== 0)
        .map(x => x.textContent);
      new UINewGuestBuilder().editGuest(guestData);
    });
  }

  // const length = guests.length;
  // generateEmptyRows(tableBody, 1);

  return tableBody;
}

/* function generateEmptyRows (tableBody, numberOfRows) {
  for (let i = 0; i < numberOfRows; i++) {
    const row = document.createElement('tr');
    tableBody.appendChild(row);

    row.appendChild(generateCheckboxCell());
    row.appendChild(generateGuestName('Add new Guest'));
    row.appendChild(generateStatus(''));
    row.appendChild(generateChildren(''));
    row.appendChild(generateModifier());
  }
} */

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

  return modifierCell;
}

function generatePagNavigation (maxPages) {
  const navigation = document.createElement('nav');
  const list = document.createElement('ul');
  list.classList.add('uk-pagination', 'uk-flex-center');
  navigation.appendChild(list);

  for (let i = 0; i < maxPages + 2; i++) {
    const navigationItem = document.createElement('li');
    list.appendChild(navigationItem);

    const link = document.createElement('a');
    link.href = '#';
    navigationItem.appendChild(link);

    if (i === 0) {
      const previous = document.createElement('span');
      previous.setAttribute('uk-pagination-previous', '');
      navigationItem.classList.add('uk-pagination-previous');
      link.appendChild(previous);
    } else if (i === maxPages + 1) {
      const next = document.createElement('span');
      next.setAttribute('uk-pagination-next', '');
      navigationItem.classList.add('uk-pagination-next');
      link.appendChild(next);
    } else {
      link.textContent = i;
      navigationItem.classList.add('paginationItem');

      if (i === 1) {
        navigationItem.classList.add('uk-active');
      }
    }

    addClickEvent(navigationItem);
  }

  return navigation;
}

function addClickEvent (element) {
  element.addEventListener('click', () => {
    const previousElem = document.getElementsByClassName('uk-active paginationItem')[0];
    const type = element.classList;

    if (type.contains('paginationItem')) {
      previousElem.classList.remove('uk-active');
      numberClickEvent(element);
    }

    if (type.contains('uk-pagination-previous')) {
      previousClickEvent(previousElem);
    }

    if (type.contains('uk-pagination-next')) {
      nextClickEvent(previousElem);
    }
  });
}

function previousClickEvent (previousElem) {
  const items = document.getElementsByClassName('paginationItem');

  if (previousElem !== items[0]) {
    const nextElem = previousElem.previousSibling;
    nextElem.classList.add('uk-active');
    previousElem.classList.remove('uk-active');

    const tablePage = parseInt(nextElem.textContent);
    updateTables(tablePage - 1);
  }
}

function nextClickEvent (previousElem) {
  const items = document.getElementsByClassName('paginationItem');

  if (previousElem !== items[items.length - 1]) {
    const nextElem = previousElem.nextSibling;
    nextElem.classList.add('uk-active');
    previousElem.classList.remove('uk-active');

    const tablePage = parseInt(nextElem.textContent);
    updateTables(tablePage - 1);
  }
}

function numberClickEvent (element) {
  const tablePage = parseInt(element.textContent);
  element.classList.add('uk-active');

  updateTables(tablePage - 1);
}

function updateTables (page) {
  const table = document.getElementsByClassName('guestListTable')[0];
  table.innerHTML = '';
  generateTables(table, page);
}
