import * as NavbarBuilder from './UINavbarBuilder.mjs';
import * as DisplayBuilder from './UIDisplayBuilder.mjs';
import UIkit from 'uikit';
UIkit.icon.call();

// LOGGING EVENT LISTENER
const logging = document.getElementById('sign-in');
const port = window.location.port;

logging.addEventListener('submit', (event) => {
  event.preventDefault();
  const uname = logging.elements.uname.value;
  const pword = logging.elements.pword.value;
  const fields = JSON.stringify([uname, pword]);

  // Fetch Data and send them to the server
  fetch(`http://localhost:${port}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: fields
  }).then(res => {
    return res.text();
  }).then(data => {
    const result = JSON.parse(data);

    if (result.accepted) {
      console.log('accepted');
      NavbarBuilder.createNavbar(result.name);
      DisplayBuilder.createMainDisplay();
      NavbarBuilder.createFooter();
    } else {
      window.alert('Logging fehlgeschlagen!');
    }
  })
    .catch(error => console.error(error));
});
