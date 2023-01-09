import UINavbarBuilder from './UINavbarBuilder.mjs';
import UIDisplayBuilder from './UIDisplayBuilder.mjs';
import UIkit from 'uikit';
UIkit.icon.call();

// LOGGING EVENT LISTENER
const logging = document.getElementById('sign-in');

logging.addEventListener('submit', (event) => {
  event.preventDefault();
  const uname = logging.elements.uname.value;
  const pword = logging.elements.pword.value;
  const fields = JSON.stringify([uname, pword]);

  // Fetch Data and send them to the server
  checkLogging(fields).then(success => {
    if (success) {
      new UINavbarBuilder().createNavbar();
      new UIDisplayBuilder().createMainDisplay();
    } else {
      window.alert('Logging fehlgeschlagen!');
    }
  }).catch(err => err.message);
});

async function checkLogging (fields) {
  const response = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: fields
  });

  if (!response.ok) {
    const message = `An Error has occured: ${response.status}`;
    throw new Error(message);
  }

  const resBody = await response.json();
  return resBody.accepted;
}
