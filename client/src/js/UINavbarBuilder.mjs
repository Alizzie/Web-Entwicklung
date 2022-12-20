const body = document.body;

// Creating Navbar
export function createNavbar (user) {
  const navbar = document.createElement('header');
  navbar.classList.add('navbar-Wrapper');
  body.insertBefore(navbar, document.getElementsByTagName('main')[0]);

  // Left Functionalities
  const functionalities = document.createElement('div');
  functionalities.classList.add('navbar-functionalities');
  const functions = ['Events', 'Guest lists', 'Seating Plans'];

  for (const element of functions) {
    const functionalty = document.createElement('p');
    functionalty.textContent = element;
    functionalities.appendChild(functionalty);
  }

  navbar.appendChild(functionalities);

  // Right User ID with Log-Out
  const userRole = document.createElement('div');
  userRole.classList.add('navbar-userRole');
  const username = document.createElement('p');
  username.textContent = user;
  userRole.appendChild(username);

  const logOut = document.createElement('div');
  logOut.classList.add('navbar-logOut');
  const logOutText = document.createElement('span');
  logOutText.textContent = 'Log Out';
  logOut.appendChild(logOutText);
  userRole.appendChild(logOut);

  navbar.appendChild(userRole);
}
