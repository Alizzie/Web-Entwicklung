export class Paginator {
  constructor (array, maxSize) {
    this._array = array;
    this._maxSize = maxSize;
    this._paginatedArray = this._paginateArray();
  }

  getPaginatedArray () {
    return this._paginatedArray;
  }

  _paginateArray () {
    const maxPages = Math.ceil(this._array.length / this._maxSize);
    return Array.from({ length: maxPages }, (_, i) => {
      const start = i * this._maxSize;
      return this._array.slice(start, start + this._maxSize);
    });
  }
}

export class UIPaginationBuilder {
  constructor (obj, maxPages) {
    this._pagObj = obj;
    this._maxPages = maxPages;
    this._buildPaginationNav();
  }

  getNavigation () {
    return this._navigation;
  }

  _buildPaginationNav () {
    this._buildOutsideWrapper();
    this._buildPreviousArrow();
    this._buildItemField();
    this._buildNextArrow();
  }

  _buildOutsideWrapper () {
    this._navigation = document.createElement('nav');
    this._navigationList = document.createElement('ul');
    this._navigationList.classList.add('uk-pagination', 'uk-flex-center');
    this._navigation.appendChild(this._navigationList);
  }

  _buildNavigationItemWrapper () {
    const navigationItem = document.createElement('li');
    this._navigationList.appendChild(navigationItem);

    const link = document.createElement('a');
    link.href = '#';
    navigationItem.appendChild(link);

    return [navigationItem, link];
  }

  _buildPreviousArrow () {
    const [item, link] = this._buildNavigationItemWrapper();
    item.classList.add('uk-pagination-previous');
    item.addEventListener('click', () => this._previousClickEvent());

    this._previous = document.createElement('span');
    this._previous.setAttribute('uk-pagination-previous', '');

    link.appendChild(this._previous);
  }

  _buildNextArrow () {
    const [item, link] = this._buildNavigationItemWrapper();
    item.classList.add('uk-pagination-next');
    item.addEventListener('click', () => this._nextClickEvent());

    this._next = document.createElement('span');
    this._next.setAttribute('uk-pagination-next', '');

    link.appendChild(this._next);
  }

  _buildItemField () {
    for (let i = 0; i < this._maxPages; i++) {
      const [item, link] = this._buildNavigationItemWrapper();

      link.textContent = i + 1;
      item.classList.add('paginationItem');

      if (i === 0) {
        item.classList.add('uk-active');
      }

      item.addEventListener('click', (event) => this._itemClickEvent(event));
    }
  }

  _itemClickEvent (event) {
    const activeElem = document.getElementsByClassName('uk-active paginationItem')[0];
    activeElem.classList.remove('uk-active');

    const clickedElem = event.target.parentElement;
    clickedElem.classList.add('uk-active');

    const nextPage = parseInt(clickedElem.textContent) - 1;
    this._pagObj.callUpdateFunc(nextPage);
  }

  _previousClickEvent () {
    const activeElem = document.getElementsByClassName('uk-active paginationItem')[0];
    const items = document.getElementsByClassName('paginationItem');

    if (activeElem !== items[0]) {
      const nextActiveElem = activeElem.previousSibling;
      nextActiveElem.classList.add('uk-active');
      activeElem.classList.remove('uk-active');

      const nextPage = parseInt(nextActiveElem.textContent) - 1;
      this._pagObj.callUpdateFunc(nextPage);
    }
  }

  _nextClickEvent () {
    const activeElem = document.getElementsByClassName('uk-active paginationItem')[0];
    const items = document.getElementsByClassName('paginationItem');

    if (activeElem !== items[items.length - 1]) {
      const nextActiveElem = activeElem.nextSibling;
      nextActiveElem.classList.add('uk-active');
      activeElem.classList.remove('uk-active');

      const nextPage = parseInt(nextActiveElem.textContent) - 1;
      this._pagObj.callUpdateFunc(nextPage);
    }
  }
}
