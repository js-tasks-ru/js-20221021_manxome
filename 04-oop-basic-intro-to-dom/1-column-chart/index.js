export default class ColumnChart {
    constructor(params = {}) {
        this.params = params;
        this.data = params.data || [];
        this.value = params.value || 0;
        this.label = params.label || "";
        this.link = params.link || "";
        this.formatHeading = params.formatHeading || (str => `${str}`);
        this.chartHeight = params.chartHeight || 50;
        this.render();
        this.initEventListeners();
    }

    getTemplate() {
        const linkA = this.link ? `<a href=${this.link} class="column-chart__link">View all</a>` : '';

        let chartContainer = ``;
        if (this.data.length === 0) {
            chartContainer = `<img src="./charts-skeleton.svg" alt="No data" >`
        }

        const maxData = Math.max(...this.data) || 1;
        const basis = this.chartHeight / maxData;

        return `
            <div class="column-chart ${this.data.length === 0 || !this.params ? " column-chart_loading" : ""}" style="--chart-height:  ${this.chartHeight}">
                <div class="column-chart__title">
                    Total ${this.label}
                    ${linkA}
                </div>
                <div class="column-chart__container">
                    ${chartContainer}
                    <div data-element="header" class="column-chart__header">
                        ${this.formatHeading(this.value)}
                    </div>
                    <div data-element="body" class="column-chart__chart">
                        ${
                            this.data.map(item => {
                                return `<div style="--value: ${Math.floor(item * basis)}" data-tooltip="${(item / maxData * 100).toFixed(0)}%"></div>`
                            }).join('')
                        }
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.getTemplate();
        this.element = element.firstElementChild;
    }

    update(newData) {
        const maxData = Math.max(...newData) || 1;
        const basis = this.chartHeight / maxData;
        const newDataStr = newData.map(item => {
            return `<div style="--value: ${Math.floor(item * basis)}" data-tooltip="${(item / maxData * 100).toFixed(0)}%"></div>`
        }).join('');
        this.element.querySelector('.column-chart__chart').innerHTML = newDataStr;
    }

    initEventListeners() {
    // NOTE: в данном методе добавляем обработчики событий, если они есть
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        // NOTE: удаляем обработчики событий, если они есть
    }
}