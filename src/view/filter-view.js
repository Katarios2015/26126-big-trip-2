import AbstractView from '../framework/view/abstract-view.js';
import {filter} from '../utils/filter-points.js';

function createFilterItemTemplate(filterType, currentFilterType, points) {
  const {type} = filterType;
  const filtredPoints = filter[type](points);
  return(`
  <div class="trip-filters__filter">
    <input id="filter-${type}" class="trip-filters__filter-input  visually-hidden" type="radio"
    name="trip-filter"
    ${type === currentFilterType ? 'checked' : ''}
     value="${type}"}
     ${filtredPoints.length === 0 ? 'disabled' : ''}>
    <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
  </div>
  `);

}

function createFilterFormTemplate(filters, currentFilterType, points) {
  const filtersTemplate = filters
    .map((filterType) => createFilterItemTemplate(filterType, currentFilterType, points))
    .join('');
  return (`<form class="trip-filters" action="#" method="get">
  ${filtersTemplate}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`);
}

export default class FilterView extends AbstractView{
  #filters = null;
  #points = null;
  #handleFilterTypeChange = null;
  #currentFilter = null;
  constructor({filters, currentFilterType, points, onFilterTypeChange}) {
    super();
    this.#filters = filters;
    this.#points = points;
    this.#handleFilterTypeChange = onFilterTypeChange;
    this.#currentFilter = currentFilterType;
    this.element.addEventListener('change', this.#filterTypeChangeHandler);
  }

  get template() {
    return createFilterFormTemplate(this.#filters, this.#currentFilter, this.#points);
  }

  #filterTypeChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterTypeChange(evt.target.value);
  };
}
