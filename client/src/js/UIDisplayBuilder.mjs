import UIkit from 'uikit';
import { Paginator, UIPaginationBuilder } from './Pagination.mjs';
import Resetter from './Resetter.mjs';
import ServerCommunications from './ServerRequests.mjs';
import UICardGenerator from './UIGenerator.mjs';
import UIGuestListBuilder from './UIGuestListBuilder.mjs';
import UINewEventBuilder from './UINewEventBuilder.mjs';

window.onresize = check;

function check () {
  const main = document.getElementsByTagName('main')[0];

  if (UIDisplayBuilder && main.classList.contains('display-event')) {
    UIDisplayBuilder.initalizeEventsDisplay();
  }
}

export default class UIDisplayBuilder {
  constructor (events) {
    this._events = events;
    this._startPagination();
  }

  static async initalizeEventsDisplay () {
    const response = await new ServerCommunications().get('/api/events');
    return new UIDisplayBuilder(response).createMainDisplay();
  }

  _startPagination () {
    this._paginatedEventList = new Paginator(this._events, this._getMaxPages()).getPaginatedArray();
    this._maxPages = Math.ceil(this._paginatedEventList.length / 2);
    this._paginator = new UIPaginationBuilder(this, this._maxPages);
    this._nextPage = 0;
  }

  _getEventCardWidth () {
    let marginWidth = 80;
    let cardWidth = 400;

    if (window.innerWidth === 500) {
      marginWidth = 0;
      cardWidth = 300;
    }

    return [marginWidth, cardWidth];
  }

  _getMaxPages () {
    const [margin, width] = this._getEventCardWidth();
    let mainWidth = window.getComputedStyle(document.getElementsByTagName('main')[0]).width;
    mainWidth = parseFloat(mainWidth.slice(0, -2));

    const fullItemWidth = margin + width;

    const maxPages = Math.floor((mainWidth + margin) / fullItemWidth);
    return maxPages;
  }

  createMainDisplay () {
    this._main = new Resetter().getMain();
    this._main.classList.add('display-event');
    const noEvent = this._checkIfEventsExist();

    if (noEvent) {
      this._card = new UICardGenerator().getCard();

      this._displayWrapper = this._generateDisplayWrapper('no-event-wrapper');
      this._card.appendChild(this._displayWrapper);
      this._noEventsDisplay();
    } else {
      this._main.appendChild(this._generateAddBtn());

      this._displayWrapper = this._generateDisplayWrapper('display-event-wrapper');
      this._main.appendChild(this._displayWrapper);
      this._generateEvents();

      this._main.appendChild(this._paginator.getNavigation());
    }
  }

  callUpdateFunc (nextPage) {
    this._nextPage = nextPage;
    this._updatePagEvents();
  }

  _checkIfEventsExist () {
    return this._events.length === 0;
  }

  // DISPLAY WHEN NO EVENT EXISTS
  _noEventsDisplay () {
    const text = document.createElement('h1');
    text.textContent = 'No Events created';

    const addEventButton = document.createElement('button');
    addEventButton.classList.add('uk-button', 'uk-button-secondary');
    addEventButton.textContent = 'Add new one';

    this._displayWrapper.appendChild(text);
    this._displayWrapper.appendChild(addEventButton);

    addEventButton.addEventListener('click', () => {
      new UINewEventBuilder().createNewEventDisplay();
    });
  }

  // DISPLAY WHEN EVENT EXISTS
  _generateDisplayWrapper (className) {
    const wrapper = document.createElement('div');
    wrapper.classList.add(className);
    return wrapper;
  }

  _updatePagEvents () {
    this._displayWrapper.innerHTML = '';
    this._generateEvents(this._nextPage);
  }

  _generateEvents () {
    for (let row = 0; row < 2; row++) {
      const curGuests = this._paginatedEventList[this._nextPage * 2 + row];

      if (!curGuests || curGuests.length === 0) {
        break;
      }

      const rowWrapper = document.createElement('div');
      rowWrapper.classList.add('display-row-wrapper');
      this._displayWrapper.appendChild(rowWrapper);

      let lastCurGuests; let lengthLastGuests = 0;
      if (row === 1) {
        lastCurGuests = this._paginatedEventList[this._nextPage * 2];
        lengthLastGuests = lastCurGuests.length;
      }

      for (let i = 0; i < curGuests.length; i++) {
        rowWrapper.appendChild(this._createEventBlock(curGuests[i], i + lengthLastGuests));
      }
    }
  }

  _createEventBlock (params, idNum) {
    const div = document.createElement('div');
    div.classList.add('uk-card', 'uk-card-default', 'event-card', 'uk-card-hover');
    div.setAttribute('id', idNum);

    div.appendChild(this._createEditBtnInsideEventCard());

    const h3 = document.createElement('h3');
    h3.classList.add('uk-card-title', 'uk-margin-remove-bottom');
    h3.textContent = params.name;
    div.appendChild(h3);

    const p = document.createElement('p');
    p.classList.add('uk-text-meta', 'uk-margin-remove-top');
    p.textContent = params.date + ', ' + params.time;
    div.appendChild(p);

    div.addEventListener('click', (event) => {
      let cardID;
      if (event.target.tagName === 'DIV') {
        cardID = parseInt(event.target.id);
      } else if (event.target.tagName === 'P' || event.target.tagName === 'H3') {
        cardID = parseInt(event.target.parentElement.id);
      }

      if (cardID != null) {
        const eventsIndex = cardID + this._nextPage * (this._getMaxPages() * 2);
        const veranstaltungId = this._events[eventsIndex].id;
        UIGuestListBuilder.initializeGuestList(veranstaltungId);
      }
    });

    return div;
  }

  _createEditBtnInsideEventCard () {
    const div = document.createElement('div');
    div.classList.add('edit-buttons-card-inside');

    div.appendChild(this._generateDeleteBtn());

    return div;
  }

  _generateDeleteBtn () {
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('uk-button', 'uk-button-secondary');
    deleteBtn.setAttribute('id', 'js-modal-comfirm');
    deleteBtn.textContent = 'Delete';

    deleteBtn.addEventListener('click', event => {
      const message = `Delete Event '${event.target.parentElement.nextSibling.textContent}'?`;
      UIkit.modal.confirm(message).then(
        () => this._deleteEventListener(event),
        () => { UIkit.notification('Canceled', { timeout: 3000 }); });
    });

    return deleteBtn;
  }

  async _deleteEventListener (event) {
    // EventCard ID + EventsArray * PageIndex = Index Of EventsArray
    const cardID = parseInt(event.target.parentElement.parentElement.id);
    const eventsIndex = cardID + this._nextPage * (this._getMaxPages() * 2);
    const data = JSON.stringify({ id: this._events[eventsIndex].id });

    const response = await new ServerCommunications('DELETE').request('/api/events', data);
    if (response) {
      UIkit.notification('Successful deleted', 'success', { timeout: 3000 });
    }

    this._events.splice(eventsIndex, 1);
    this._startPagination();

    this.createMainDisplay();
  }

  _generateAddBtn () {
    const div = document.createElement('div');
    div.classList.add('uk-flex', 'uk-flex-center');

    const addBtn = document.createElement('button');
    addBtn.classList.add('uk-button', 'uk-button-default');
    addBtn.textContent = 'Create Event';

    div.appendChild(addBtn);

    addBtn.addEventListener('click', () => {
      new UINewEventBuilder().createNewEventDisplay();
    });

    return div;
  }
}
