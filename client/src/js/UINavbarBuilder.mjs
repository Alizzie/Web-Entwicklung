import { createMainDisplay } from './UIDisplayBuilder.mjs';

const body = document.body;
// Creating Navbar
export function createNavbar () {
  const navbar = document.createElement('nav');
  navbar.classList.add('uk-navbar-container');
  body.insertBefore(navbar, document.getElementsByTagName('main')[0]);

  // Left Functionalities
  const leftWrapper = document.createElement('div');
  leftWrapper.classList.add('uk-navbar-left');
  navbar.appendChild(leftWrapper);

  const functionalities = document.createElement('ul');
  functionalities.classList.add('uk-navbar-nav');
  leftWrapper.appendChild(functionalities);

  const functionality = document.createElement('li');
  functionality.classList.add('uk-active');
  const eventText = document.createElement('a');
  eventText.href = '/';
  eventText.textContent = 'Events';
  functionality.appendChild(eventText);
  functionalities.appendChild(functionality);

  functionality.addEventListener('click', () => createMainDisplay());

  // Log-Out
  const rightWrapper = document.createElement('div');
  rightWrapper.classList.add('uk-navbar-right');
  navbar.appendChild(rightWrapper);

  const userRole = document.createElement('ul');
  userRole.classList.add('uk-navbar-nav');
  rightWrapper.appendChild(userRole);

  const logOut = document.createElement('li');
  const uText = document.createElement('a');
  uText.textContent = 'Log Out';
  uText.href = '#';
  logOut.appendChild(uText);
  userRole.appendChild(logOut);
}

export function createFooter () {
  const footer = document.createElement('footer');
  footer.classList.add('uk-navbar-container');
  body.appendChild(footer);

  const card = document.createElement('div');
  card.classList.add('uk-navbar-left');
  footer.appendChild(card);

  const linksWrapper = document.createElement('ul');
  linksWrapper.classList.add('uk-navbar-nav');
  card.appendChild(linksWrapper);

  const links = ['Imprint', 'Data Protection'];
  for (const link of links) {
    const linkWrapper = document.createElement('li');
    const linkText = document.createElement('a');
    linkText.href = '#';
    linkText.textContent = link;
    linkWrapper.appendChild(linkText);
    linksWrapper.appendChild(linkWrapper);
  }
}
