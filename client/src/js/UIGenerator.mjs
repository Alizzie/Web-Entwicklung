import Resetter from './Resetter.mjs';

export default class UICardGenerator {
  constructor () {
    this._main = new Resetter().getMain();
    this._initalizeCard();
  }

  _initalizeCard () {
    this._classes = ['uk-card', 'uk-card-default', 'uk-card-large', 'uk-width-1-2', 'uk-padding-large', 'uk-card-hover', 'display-wrapper'];
    this._card = document.createElement('div');
    this._main.appendChild(this._card);
    this._applyCardClasses();
  }

  formularCardConstructor (heading, className, btnTxt, params) {
    this._cardHeading = heading;
    this._cardClassName = className;
    this._cardBtnTxt = btnTxt;
    this._params = params;
  }

  getMain () {
    return this._main;
  }

  getCard () {
    return this._card;
  }

  getFormular () {
    return this._form;
  }

  createCardFormularDisplay () {
    this._card.classList.add(this._cardClassName);
    this._card.appendChild(this._createHeading());
    this._card.appendChild(this._createFormular());
  }

  _applyCardClasses () {
    for (const newClass of this._classes) {
      this._card.classList.add(newClass);
    }
  }

  _createHeading () {
    const heading = document.createElement('h1');
    heading.classList.add('uk-heading-line', 'uk-text-center');

    const text = document.createElement('span');
    text.textContent = this._cardHeading;
    heading.appendChild(text);
    return heading;
  }

  _createFormular () {
    this._form = document.createElement('form');
    this._form.method = 'post';
    this._form.action = '/';
    this._form.setAttribute('id', 'formular');
    this._form.classList.add('event-params-formular');

    const div = document.createElement('div');
    this._createFormForEvent(div);

    this._form.appendChild(div);
    this._form.appendChild(this._createBtn());

    return this._form;
  }

  _createBtn () {
    const button = document.createElement('button');
    button.textContent = this._cardBtnTxt;
    button.type = 'submit';
    button.classList.add('uk-button', 'uk-button-default');

    return button;
  }

  _createFormForEvent (element) {
    for (const param of this._params) {
      element.appendChild(this._createAttributSections(param));
    }
  }

  _createAttributSections (attrType) {
    const [attrArray, className, heading] = attrType;
    const fieldset = document.createElement('fieldset');
    fieldset.classList.add('uk-fieldset');

    const text = document.createElement('legend');
    text.textContent = heading;
    fieldset.appendChild(text);

    for (const attr of attrArray) {
      const wrapper = this._createAttribut(attr, className);
      fieldset.appendChild(wrapper);
    }

    return fieldset;
  }

  _createAttribut (attr, className) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('creation-form-elements');
    wrapper.classList.add(className);

    this._generateParameters(wrapper, attr);

    return wrapper;
  }

  _generateParameters (wrapper, attr) {
    const label = document.createElement('label');
    label.classList.add('uk-form-label');
    label.htmlFor = attr.name;
    label.textContent = attr.name;

    this._checkAttributes(attr);
    this._generateOptionalAttributes(attr);

    wrapper.appendChild(label);
    wrapper.appendChild(this._input);
  }

  _checkAttributes (attr) {
    if (attr.type === 'select') {
      this._input = document.createElement('select');
      this._input.classList.add('uk-select', 'uk-form-small');
      this._input.ariaLabel = 'Select';
      this._input.name = attr.name;
      this._generateSelectOptions(attr.options);
    } else {
      this._input = document.createElement('input');
      this._input.type = attr.type;
      this._input.name = attr.name;

      if (attr.type === 'checkbox') {
        this._input.classList.add('uk-checkbox');
      } else {
        this._input.classList.add('uk-input', 'uk-form-small');
      }
    }
  }

  _generateSelectOptions (options) {
    for (const status of options) {
      const field = document.createElement('option');
      this._input.appendChild(field);

      field.textContent = status;
    }
  }

  _generateOptionalAttributes (attr) {
    if (attr.placeholder) {
      this._input.placeholder = attr.placeholder;
    }

    if (attr.min) {
      this._input.min = attr.min;
    }
  }
}
