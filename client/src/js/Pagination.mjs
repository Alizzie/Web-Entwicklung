export class Paginator {
  constructor (array, maxSize) {
    this.array = array;
    this.maxSize = maxSize;
    this.paginatedArray = this._paginateArray();
  }

  getPaginatedArray () {
    return this.paginatedArray;
  }

  _paginateArray () {
    const maxPages = Math.ceil(this.array.length / this.maxSize);
    return Array.from({ length: maxPages }, (_, i) => {
      const start = i * this.maxSize;
      return this.array.slice(start, start + this.maxSize);
    });
  }
}

export class UIPaginationBuilder {
  constructor (updateFunc, maxPages) {
    this.updateFunc = updateFunc;
    this.maxPages = maxPages;
    this._buildPaginationNav();
  }

  getNavigation () {
    return this.navigation;
  }

  _buildPaginationNav () {
    this._buildOutsideWrapper();
    this._buildPreviousArrow();
    this._buildItemField();
    this._buildNextArrow();
  }

  _buildOutsideWrapper () {
    this.navigation = document.createElement('nav');
    this.navigationList = document.createElement('ul');
    this.navigationList.classList.add('uk-pagination', 'uk-flex-center');
    this.navigation.appendChild(this.navigationList);
  }

  _buildNavigationItemWrapper () {
    const navigationItem = document.createElement('li');
    this.navigationList.appendChild(navigationItem);

    const link = document.createElement('a');
    link.href = '#';
    navigationItem.appendChild(link);

    return [navigationItem, link];
  }

  _buildPreviousArrow () {
    const [item, link] = this._buildNavigationItemWrapper();
    item.classList.add('uk-pagination-previous');
    item.addEventListener('click', () => this._previousClickEvent());

    this.previous = document.createElement('span');
    this.previous.setAttribute('uk-pagination-previous', '');

    link.appendChild(this.previous);
  }

  _buildNextArrow () {
    const [item, link] = this._buildNavigationItemWrapper();
    item.classList.add('uk-pagination-next');
    item.addEventListener('click', () => this._nextClickEvent());

    this.next = document.createElement('span');
    this.next.setAttribute('uk-pagination-next', '');

    link.appendChild(this.next);
  }

  _buildItemField () {
    for (let i = 0; i < this.maxPages; i++) {
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
    this.updateFunc(nextPage);
  }

  _previousClickEvent () {
    const activeElem = document.getElementsByClassName('uk-active paginationItem')[0];
    const items = document.getElementsByClassName('paginationItem');

    if (activeElem !== items[0]) {
      const nextActiveElem = activeElem.previousSibling;
      nextActiveElem.classList.add('uk-active');
      activeElem.classList.remove('uk-active');

      const nextPage = parseInt(nextActiveElem.textContent) - 1;
      this.updateFunc(nextPage);
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
      this.updateFunc(nextPage);
    }
  }
}
