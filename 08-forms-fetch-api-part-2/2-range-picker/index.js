export default class RangePicker {
  element;

  constructor({from = new Date(), to = new Date()}) {
    this.from = from;
    this.to = to;
    this.fromYear = this.from.getFullYear();
    this.fromMonth = this.from.getMonth();
    this.fromDay = this.from.getDate();

    this.render();
  }

  formatDate(date) {
    const year = date.getFullYear() % 100;
    const month = date.getMonth() < 10 ? '0' + date.getMonth() : date.getMonth();
    const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    return month + '/' + day + '/' + year;
  }

  setMonthCalendar(year, month) {
    const firstDay = new Date(year, month + 1, 1);
    const lastDay = new Date(year, month + 2, 0);
    const firstWeekDay = firstDay.getDay();

    let calendarString = `<button type="button" class="rangepicker__cell" data-value="${firstDay}" style="--start-from: ${firstWeekDay}">1</button>`;

    for (let i=2; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month + 1, i);
      calendarString += `<button type="button" class="rangepicker__cell" data-value="${date}">${i}</button>`;
    }

    const calendarWrap = document.createElement("div");
    calendarWrap.classList.add('rangepicker__date-grid');
    calendarWrap.innerHTML = calendarString;

    return calendarWrap.outerHTML;
  }

  getTemplate() {
    return `
      <div class="rangepicker rangepicker_open">
        <div class="rangepicker__input" data-element="input">
          <span data-element="from">${this.formatDate(this.from)}</span> -
          <span data-element="to">${this.formatDate(this.to)}</span>
        </div>
        <div class="rangepicker__selector" data-element="selector">
          <div class="rangepicker__selector-arrow"></div>
          <div class="rangepicker__selector-control-left"></div>
          <div class="rangepicker__selector-control-right"></div>
          <div class="rangepicker__calendar">
            <div class="rangepicker__month-indicator">
              <time datetime="November">November</time>
            </div>
            <div class="rangepicker__day-of-week">
              <div>Пн</div>
              <div>Вт</div>
              <div>Ср</div>
              <div>Чт</div>
              <div>Пт</div>
              <div>Сб</div>
              <div>Вс</div>
            </div>
            ${this.setMonthCalendar(this.fromYear, this.fromMonth)}
          </div>
          <div class="rangepicker__calendar">
            <div class="rangepicker__month-indicator">
              <time datetime="December">December</time>
            </div>
            <div class="rangepicker__day-of-week">
              <div>Пн</div>
              <div>Вт</div>
              <div>Ср</div>
              <div>Чт</div>
              <div>Пт</div>
              <div>Сб</div>
              <div>Вс</div>
            </div>
            ${this.setMonthCalendar(this.fromYear, this.fromMonth+1)}
            </div>
          </div>
        </div>
      </div>`
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

  render() {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    return this.element;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
