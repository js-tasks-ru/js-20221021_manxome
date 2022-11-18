import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element;
  data;

  constructor({url = '', range = {from: new Date(), to: new Date()}, label = '', link = '', formatHeading = (str => `${str}`)} = {}, value = 0) {
    this.url = url;
    this.range = range;
    this.label = label;
    this.link = link;
    this.formatHeading = formatHeading;
    this.chartHeight = 50;
    this.value = value;

    this.render();
    this.loadData(BACKEND_URL + '/api/dashboard/' + this.label);
  }

  loadData(url) {
    fetchJson(url)
      .then(data => {
        this.data = data;
        this.update(this.range.from, this.range.to);
      })
  }

  update(dateFrom, dateTo) {
    let filteredObject = {};
    if (dateFrom.getFullYear() === dateTo.getFullYear() && dateFrom.getMonth() === dateTo.getMonth() && dateFrom.getDate() === dateTo.getDate()) {
      filteredObject = this.data;
    } else {
      for (const key in this.data) {
        if (Date.parse(key) >= dateFrom && Date.parse(key) <= dateTo ) {
          filteredObject = {...filteredObject, [key]: this.data[key]};
        }
      }
    }
console.log('filteredObject', filteredObject);
    const filteredArray = Object.values(filteredObject);
    const value = filteredArray.reduce((sum, el) => {
      return sum + el;
    }, 0);
    this.getSubElements(this.element).header.innerHTML = this.formatHeading(value);

    const maxData = Math.max(...filteredArray) || 1;
    const basis = this.chartHeight / maxData;
    const newDataStr = filteredArray.map(item => {
      return `<div style="--value: ${Math.floor(item * basis)}" data-tooltip="${(item / maxData * 100).toFixed(0)}%"></div>`
    }).join('');
    this.getSubElements(this.element).body.innerHTML = newDataStr;
    this.element.classList.remove('column-chart_loading');

    return filteredObject;
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  getTemplate() {
    const linkA = this.link ? `<a href=${this.link} class="column-chart__link">View all</a>` : '';

    return `
            <div class="column-chart column-chart_loading" style="--chart-height:  ${this.chartHeight}">
              <div class="column-chart__title">
                Total ${this.label}
                ${linkA}
              </div>
              <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                <div data-element="body" class="column-chart__chart"></div>
              </div>
            </div>
          `;
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
