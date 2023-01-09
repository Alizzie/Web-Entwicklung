import { Paginator, UIPaginationBuilder } from './Pagination.mjs';
import Resetter from './Resetter.mjs';
import UICardGenerator from './UIGenerator.mjs';
import UINewEventBuilder from './UINewEventBuilder.mjs';

const events = [

];

export default class UIDisplayBuilder {
  constructor () {
    this._events = this._getEvents();
    this._main = new Resetter().getMain();

    this._paginatedEventList = new Paginator(events, 6).getPaginatedArray();
    this._paginator = new UIPaginationBuilder(this, this._paginatedEventList.length);
  }

  createMainDisplay () {
    const noEvent = this._checkIfEventsExist();

    if (noEvent) {
      this._card = new UICardGenerator().getCard();
      this._card.appendChild(this._noEventsDisplay());
    } else {
      this._main.appendChild(this._generateAddBtn());
      this._main.appendChild(this._eventDisplay());

      this._main.appendChild(this._paginator.getNavigation());
    }
  }

  callUpdateFunc (nextPage) {
    this._updatePagEvents(nextPage);
  }

  _getEvents () {
    for (let i = 0; i < Math.random() * 10; i++) {
      events.push({
        name: 'Event 5',
        date: '2020-02-2002',
        time: '12:09'
      });
    }

    return events;
  }

  _checkIfEventsExist () {
    return this._events.length < 7;
  }

  // DISPLAY WHEN NO EVENT EXISTS
  _noEventsDisplay () {
    const wrapper = document.createElement('div');
    wrapper.classList.add('no-event-wrapper');

    const text = document.createElement('h1');
    text.textContent = 'No Events created';

    const addEventButton = document.createElement('button');
    addEventButton.classList.add('uk-button', 'uk-button-secondary');
    addEventButton.textContent = 'Add new one';

    wrapper.appendChild(text);
    wrapper.appendChild(addEventButton);

    addEventButton.addEventListener('click', () => {
      new UINewEventBuilder().createNewEventDisplay();
    });

    return wrapper;
  }

  // DISPLAY WHEN EVENT EXISTS
  _eventDisplay () {
    const wrapper = document.createElement('div');
    wrapper.classList.add('display-event-wrapper');

    this._generateEvents(wrapper, 0);

    return wrapper;
  }

  _updatePagEvents (pageIndex) {
    const eventWrapper = document.getElementsByClassName('display-event-wrapper')[0];
    eventWrapper.innerHTML = '';
    this._generateEvents(eventWrapper, pageIndex);
  }

  _generateEvents (wrapper, pageIndex) {
    const eventArr = new Paginator(events, 6).getPaginatedArray();

    // ITERATE THROUGH ALL EVENTS IN DATABASE
    for (const e of eventArr[pageIndex]) {
      wrapper.appendChild(this._createEventBlock(e));
    }
  }

  _createEventBlock (params) {
    const div = document.createElement('div');
    div.classList.add('uk-card', 'uk-card-default', 'event-card', 'uk-card-hover');

    div.appendChild(this._createEditBtnInsideEventCard());

    const h3 = document.createElement('h3');
    h3.classList.add('uk-card-title', 'uk-margin-remove-bottom');
    h3.textContent = params.name;
    div.appendChild(h3);

    const p = document.createElement('p');
    p.classList.add('uk-text-meta', 'uk-margin-remove-top');
    p.textContent = params.date + ', ' + params.time;
    div.appendChild(p);

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
    deleteBtn.setAttribute('id', 'deleteBtn');
    deleteBtn.textContent = 'Delete';

    // TODO : Delete Guests from DATABANK AS CLICK EVENT

    return deleteBtn;
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
