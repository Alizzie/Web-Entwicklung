
export function eventRequest (field) {
  const port = window.location.port;
  fetch(`http://localhost:${port}/api/login`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    body: field
  }).then((res) => res.text)
    .then(data => {
      const result = JSON.parse(data);
      return result;
    })
    .catch((err) => {
      throw err;
    });
}

// Fetch(/api/login)
// Fetch(url) liefert get-Aufruf
// const response = await fetch(url);
// await body = response.json();

// const response = await fetch(/api/login/${daten}) => GET server response with daten
// await body = response.json(); => Antwort Body
