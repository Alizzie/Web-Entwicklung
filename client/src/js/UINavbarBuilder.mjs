import UIDisplayBuilder from './UIDisplayBuilder.mjs';

export default class UINavbarBuilder {
  constructor () {
    this._body = document.body;
    this._navbar = this._createNavbarConstruction();
  }

  createNavbar () {
    this._body.insertBefore(this._navbar, document.getElementsByTagName('main')[0]);

    this._fillLeftSide();
    this._fillRightSide();
  }

  _createNavbarConstruction () {
    const navbar = document.createElement('nav');
    navbar.classList.add('uk-navbar-container');

    // Left Side
    this._leftWrapper = document.createElement('div');
    this._leftWrapper.classList.add('uk-navbar-left');
    navbar.appendChild(this._leftWrapper);

    // Right Side
    this._rightWrapper = document.createElement('div');
    this._rightWrapper.classList.add('uk-navbar-right');
    navbar.appendChild(this._rightWrapper);

    return navbar;
  }

  _fillLeftSide () {
    const links = document.createElement('ul');
    links.classList.add('uk-navbar-nav');
    this._leftWrapper.appendChild(links);

    const linkItem = document.createElement('li');
    linkItem.classList.add('uk-active');
    const text = document.createElement('a');
    text.textContent = 'Events';
    linkItem.appendChild(text);
    links.appendChild(linkItem);

    linkItem.addEventListener('click', () => UIDisplayBuilder.initalizeEventsDisplay());
  }

  _fillRightSide () {
    const userRole = document.createElement('ul');
    userRole.classList.add('uk-navbar-nav');
    this._rightWrapper.appendChild(userRole);

    const logOut = document.createElement('li');
    const uText = document.createElement('a');
    uText.textContent = 'Log Out';
    uText.href = '/';
    logOut.appendChild(uText);
    userRole.appendChild(logOut);
  }
}
