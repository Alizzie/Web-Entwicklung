import ServerCommunications from './ServerRequests.mjs';
import UICardGenerator from './UIGenerator.mjs';

export default class SignUpBuilder {
  constructor () {
    this._heading = 'Sign Up';
    this._cName = 'creation-signUp';
    this._btnText = 'Sign Up';
    this._signUpAttributes = this._getParams();
    this._sParams = [[this._signUpAttributes, 'creation-signUp-attr', 'Sign Up Parameters']];
    this._cardGenerator = new UICardGenerator();
  }

  createSignUpDisplay () {
    this._cardGenerator.formularCardConstructor(this._heading, this._cName, this._btnText, this._sParams);
    this._cardGenerator.createCardFormularDisplay();
    this._initializeSignUp();
  }

  _initializeSignUp () {
    const formular = this._cardGenerator.getFormular();
    const elements = formular.elements;
    formular.addEventListener('submit', (event) => {
      const data = JSON.stringify({
        name: elements[1].value,
        password: elements[2].value,
        email: elements[4].value
      });
      new ServerCommunications('POST').request('/api/login/signUp', data);
    });
  }

  _getParams () {
    return [
      {
        name: 'Name',
        type: 'text',
        placeholder: 'Your name'
      },
      {
        name: 'Password',
        type: 'password'
      },
      {
        name: 'Confirm Password',
        type: 'password'
      },
      {
        name: 'Email',
        type: 'email'
      }
    ];
  }
}