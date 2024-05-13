import AbstractView from '../framework/view/abstract-view.js';
import {SORTS} from '../const.js';

function createSortItemTemplate(sortType) {

  const disable = (sortType === 'event' || sortType === 'offers') ? 'disabled' : '';
  return(`
  <div class="trip-sort__item  trip-sort__item--${sortType}">
  <input id="sort-${sortType}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sortType}"${disable}>
  <label class="trip-sort__btn" for="sort-${sortType}">${sortType}</label>
</div>
  `);
}

function createSortTemplate() {
  return (`<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
  ${SORTS.map((item)=> createSortItemTemplate(item)).join('')}
</form>`);
}

export default class SortView extends AbstractView{
  get template() {
    return createSortTemplate();
  }
}
