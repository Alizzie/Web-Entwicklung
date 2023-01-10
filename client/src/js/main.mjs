import UINavbarBuilder from './UINavbarBuilder.mjs';
import UIDisplayBuilder from './UIDisplayBuilder.mjs';
import UIkit from 'uikit';
import ServerCommunications from './ServerRequests.mjs';
UIkit.icon.call();

// LOGGING EVENT LISTENER
const logging = document.getElementById('sign-in');

logging.addEventListener('submit', (event) => {
  event.preventDefault();
  const uname = logging.elements.uname.value;
  const pword = logging.elements.pword.value;
  const data = JSON.stringify([uname, pword]);

  // Fetch Data and send them to the server
  checkLogging(data).then(success => {
    if (success) {
      UIkit.notification('Successful Logging', 'success', { timeout: 5000 });
      new UINavbarBuilder().createNavbar();
      UIDisplayBuilder.initalizeEventsDisplay();
    } else {
      UIkit.notification('Logging failed', 'danger', { timeout: 5000 });
    }
  }).catch(err => err.message);
});

async function checkLogging (data) {
  const response = await new ServerCommunications('POST').request('/api/login', data);
  return response.accepted;
}
