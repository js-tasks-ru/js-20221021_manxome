export default class SortableTable {
    constructor(headerConfig = [], data = []) {
        this.headerConfig = headerConfig;
        this.data = data;

        this.render();
    }

    getHeaderTemplate() {
        return `
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${
                    this.headerConfig.map(item => {
                        return `<div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}" data-order="">
                            <span>${item.title}</span>
                            ${  item.sortable ?
                                `<span data-element="arrow" class="sortable-table__sort-arrow">
                                    <span class="sort-arrow"></span>
                                </span>` :  ``
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
                ${
                    this.data.map(row => {
                        return `
                            <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
                                ${
                                    this.headerConfig.map(cell => {
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
        console.log(bodyRows);
        return bodyRows;
    }

    getFields() {
        let fields = [];
        for (let item of this.headerConfig) {
            fields.push(item.id);
        }
        console.log('fields', fields);
        return fields;
    }

    getTemplate() {
        return `
            <div class="sortable-table">
                ${this.getHeaderTemplate() + this.getBodyTemplate()}
            </div>
            `
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.getTemplate();
        this.element = element.firstElementChild;

        this.headTable = this.element.querySelector('[data-element="header"]');
        this.bodyTable = this.element.querySelector('[data-element="body"]');
        this.subElements = {header: this.headTable, body: this.bodyTable};
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
                {caseFirst: 'upper'});
            } else if (this.headerConfig[fieldIndex].sortType === 'number') {
                return direction * (row1.children[fieldIndex].innerHTML - row2.children[fieldIndex].innerHTML);
            }
            return;
        });

        this.bodyTable.innerHTML = sortedRows.map(item => {
            console.log(item.outerHTML);
            return item.outerHTML;
        }).join('');

        for (let elem of this.headTable.querySelectorAll(`[data-order]`)) {
            elem.dataset.order = '';
        }
        this.headTable.querySelector(`[data-id="${field}"]`).dataset.order = order;
    }
}

