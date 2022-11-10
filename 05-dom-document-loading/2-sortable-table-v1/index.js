export default class SortableTable {
  element;
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  getHeaderTemplate() {
    return `
      <div data-element="header" class="sortable-table__header sortable-table__row">
        ${this.headerConfig.map(item => {
            return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
              <span>${item.title}</span>
              ${item.sortable ?
              `<span data-element="arrow" class="sortable-table__sort-arrow">
                  <span class="sort-arrow"></span>
              </span>` : ``
              }
              </div>`;
          }).join('')
        }
      </div>
      `
  }

  getBodyTemplate() {
    return `
      <div data-element="body" class="sortable-table__body">
        ${this.data.map(row => {
          return `<a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
            ${this.headerConfig.map(cell => {
              const headerCell = cell.template ?
                cell.template(this.data) :
                `<div class="sortable-table__cell">${row[cell.id]}</div>`;
              return headerCell;
            }).join('')
            }
            </a>
            `
          }).join('')
        }
      </div>
      `
  }

  getRows() {
    const bodyRows = Array.from(this.bodyTable.querySelectorAll('.sortable-table__row'));
    return bodyRows;
  }

  getFields() {
    let fields = this.headerConfig.map(item => item.id);
    return fields;
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
    return `
      <div class="sortable-table">
          ${this.getHeaderTemplate()}
          ${this.getBodyTemplate()}
      </div>
      `
  }

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.headTable = this.element.querySelector('[data-element="header"]');
    this.bodyTable = this.element.querySelector('[data-element="body"]');
    this.subElements = this.getSubElements(this.element);
    this.rows = this.getRows();
    this.fields = this.getFields();
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }

  sort(field = '', order = '') {
    const directions = {
      asc: 1,
      desc: -1
    };
    const direction = directions[order];
    const fieldIndex = this.fields.indexOf(field);

    let sortedRows = [...this.rows].sort((row1, row2) => {
      if (this.headerConfig[fieldIndex].sortType === 'string') {
        return direction * row1.children[fieldIndex].innerHTML.localeCompare(row2.children[fieldIndex].innerHTML,
          ['ru', 'en'],
          { caseFirst: 'upper' });
      } else if (this.headerConfig[fieldIndex].sortType === 'number') {
        return direction * (row1.children[fieldIndex].innerHTML - row2.children[fieldIndex].innerHTML);
      }
      return;
    });

    this.bodyTable.innerHTML = sortedRows.map(item => {
      return item.outerHTML;
    }).join('');

    for (const elem of this.headTable.querySelectorAll(`[data-order]`)) {
      elem.dataset.order = '';
    }
    this.headTable.querySelector(`[data-id="${field}"]`).dataset.order = order;
  }
}

