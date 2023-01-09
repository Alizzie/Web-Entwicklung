export default class Resetter {
  constructor () {
    this._main = document.getElementsByTagName('main')[0];
    this.resetMain();
  }

  resetMain () {
    this._main.textContent = '';
    this._main.className = '';
  }

  getMain () {
    return this._main;
  }
}
