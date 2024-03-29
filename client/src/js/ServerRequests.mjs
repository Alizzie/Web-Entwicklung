export default class ServerCommunications {
  constructor (method = 'GET') {
    this._method = method;
  }

  async get (url) {
    const response = await fetch(url, {
      method: this._method,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      this._onError(response.status);
    }

    const resBody = await response.json();
    return resBody;
  }

  async request (url, data) {
    const response = await fetch(url, {
      method: this._method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: data
    });

    if (!response.ok) {
      this._onError(response.status);
    }

    const resBody = await response.json();
    return resBody;
  }

  _onError (status) {
    const message = `An Error has occured: ${status}`;
    throw new Error(message);
  }
}
