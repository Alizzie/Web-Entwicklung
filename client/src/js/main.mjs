import * as NavbarBuilder from './UINavbarBuilder.mjs';
import * as DisplayBuilder from './UIDisplayBuilder.mjs';

const logging = document.getElementById('sign-in');
console.log(logging);

logging.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = logging.elements.uname.value;
  const password = logging.elements.pword.value;
  const user = [username, password];
  console.log(user);

  NavbarBuilder.createNavbar(user);
  DisplayBuilder.createMainDisplay();
});
