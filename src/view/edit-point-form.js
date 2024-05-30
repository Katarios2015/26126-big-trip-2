import PointFormView from '../view/point-form.js';
import {getDestinationByTargetName} from '../utils/point.js';

import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

export default class EditPointFormView extends PointFormView{
  _handleEditFormButtonClick = null;
  #datepickerFrom = null;
  #datepickerTo = null;

  constructor({point, dataDestinations, dataOffers, buttonText, isAddPoint, createRollUp, onEditFormSubmit, onEditFormButtonClick}) {
    super({point, dataDestinations, dataOffers,isAddPoint, buttonText, createRollUp, onEditFormSubmit});

    this._setState(EditPointFormView.parsePointToState(point));

    this._handleEditFormButtonClick = onEditFormButtonClick;
    this._restoreHandlers();

  }

  _restoreHandlers() {
    this.element.addEventListener('submit', this._editFormSubmitHandler);
    this.element.querySelector('.event__rollup-btn')
      .addEventListener('click', this._editFormButtonHandler);

    this.element.querySelectorAll('.event__type-input')
      .forEach((type)=> {
        type.addEventListener('click',this.#pointTypeInputHandler);
      });

    this.element.querySelectorAll('.event__offer-checkbox')
      .forEach((checkbox)=> {
        checkbox.addEventListener('change', this.#pointOfferInputHandler);
      });

    this.element.querySelector('.event__input--destination')
      .addEventListener('change',this.#pointDestinationInputHandler);
    this.element.querySelector('.event__input--price')
      .addEventListener('change',this.#pointPriceInputHandler);

    this.#setDatepicker();
  }

  #pointTypeInputHandler = (evt) => {
    evt.preventDefault();
    this.updateElement({
      type: evt.target.value,
      offers: []
    });
  };

  #pointDestinationInputHandler = (evt) => {
    evt.preventDefault();
    const destinationId = getDestinationByTargetName(this._dataDestinations, evt.target.value).id;
    this.updateElement({
      destination: destinationId ? destinationId : ''
    });
  };

  #pointOfferInputHandler = (evt) => {
    evt.preventDefault();
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    this._setState({
      offers: checkedOffers.map((offer)=>offer.dataset.offerId)
    });

  };

  #pointPriceInputHandler = (evt) => {
    evt.preventDefault();
    this._setState({
      basePrice: evt.target.value
    });
  };

  removeElement() {
    super.removeElement();

    if (this.#datepickerFrom) {
      this.#datepickerFrom.destroy();
      this.#datepickerFrom = null;
    }
    if (this.#datepickerTo) {
      this.#datepickerTo.destroy();
      this.#datepickerTo = null;
    }
  }

  #dateChangeHandler = ([userDateFrom]) => {
    this.updateElement({
      dateFrom: userDateFrom,
      dateTo: userDateFrom,
    });
  };

  #dateToChangeHandler = ([userTo]) => {
    this.updateElement({
      dateTo: userTo,
    });
  };

  #setDatepicker() {
    this.#datepickerFrom = flatpickr(
      this.element.querySelector('[name="event-start-time"]'),
      {
        dateFormat: 'j/m/y H:S',
        defaultDate: this._state.dateFrom,
        //minDate: 'today',
        onChange: this.#dateChangeHandler,
      },
    );
    this.#datepickerTo = flatpickr(
      this.element.querySelector('[name="event-end-time"]'),
      {
        dateFormat: 'j/m/y H:S',
        defaultDate: this._state.dateTo,
        minDate: this._state.dateFrom,
        onChange: this.#dateToChangeHandler,
      },
    );
  }

  _editFormButtonHandler = (evt) => {
    evt.preventDefault();
    this._handleEditFormButtonClick();
  };

}
