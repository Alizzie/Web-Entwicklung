import UIkit from 'uikit';
import ServerCommunications from './ServerRequests.mjs';
import UICardGenerator from './UIGenerator.mjs';

export default class SignUpBuilder {
  constructor () {
    this._heading = 'Sign Up';
    this._cName = 'creation-signUp';
    this._btnText = 'Sign Up';
    this._signUpAttributes = this._getParams();
    this._sParams = [[this._signUpAttributes, 'creation-signUp-attr', '']];
    this._cardGenerator = new UICardGenerator();
  }

  createSignUpDisplay () {
    this._cardGenerator.formularCardConstructor(this._heading, this._cName, this._btnText, this._sParams);
    this._cardGenerator.createCardFormularDisplay();

    this._addBackToLoggingBtn();
    this._initializeSignUp();
  }

  _addBackToLoggingBtn () {
    const button = document.createElement('button');
    button.classList.add('uk-button', 'uk-button-default');
    button.textContent = 'Back To Login';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      document.location.href = '/';
    });

    const signUpBtn = document.getElementsByTagName('button')[0];
    signUpBtn.parentElement.insertBefore(button, signUpBtn.lastElementChild);
  }

  _initializeSignUp () {
    const formular = this._cardGenerator.getFormular();
    const elements = formular.elements;
    formular.addEventListener('submit', (event) => {
      event.preventDefault();

      if (elements.Password.value === elements['Confirm Password'].value) {
        const data = JSON.stringify({
          name: elements.Name.value,
          password: elements.Password.value,
          email: elements.Email.value
        });

        this._sendSignUpData(data);
      } else {
        UIkit.notification('Confirmed Password wrong!', 'danger', { timeout: 3000 });
      }
    });
  }

  _sendSignUpData (data) {
    const response = new ServerCommunications('POST').request('/api/login/signUp', data);
    response.then(data => {
      if (data) {
        UIkit.notification('Account successful created', 'success', { timeout: 3000 });
      } else {
        UIkit.notification('Failed to create new account', 'danger', { timeout: 3000 });
      }

      document.location.href = '/';
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
