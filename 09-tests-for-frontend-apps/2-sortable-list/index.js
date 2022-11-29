export default class SortableList {
  element;

  constructor({items = []}) {
    this.items = items;

    this.render();
    this.initEventListeners();
  }

  getTemplate() {
    return this.items.map(item => {
      item.classList.add('sortable-list__item');
      item.dataset.item = '';
      return item.outerHTML;
    }).join('');
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

  createEmptyBLock() {
    const element = document.createElement("li");
    element.classList.add('sortable-list__item');
    element.classList.add('sortable-list__placeholder');
    return element;
  }

  initEventListeners() {
    const removeBtns = this.element.querySelectorAll('[data-delete-handle]');

    for (const btn of removeBtns) {
      btn.addEventListener("pointerdown", (e) => {
        e.preventDefault;
        btn.closest('[data-item]').remove();
      })
    }

    this.element.addEventListener('pointerdown', event => this.onThumbPointerDown(event));
  }

  onThumbPointerDown(event) {
    if (!event.target.closest('[data-grab-handle]')) return;

    this.thumbElem = event.target.closest('[data-item]');
    event.preventDefault();

    this.shiftX = event.clientX - this.thumbElem.getBoundingClientRect().left;
    this.shiftY = event.clientY - this.thumbElem.getBoundingClientRect().top;
    const elemWidth = this.thumbElem.offsetWidth;
    const elemHeight = this.thumbElem.offsetHeight;

    this.thumbElem.classList.add('sortable-list__item_dragging');

    this.thumbElem.style.position = 'absolute';
    this.thumbElem.style.zIndex = 1000;
    this.thumbElem.style.width = elemWidth + 'px';
    this.element.append(this.thumbElem);

    this.emptyBlock = this.createEmptyBLock(elemWidth, elemHeight);
    this.thumbElem.after(this.emptyBlock);

    this.moveAt(event.clientX, event.clientY);

    document.addEventListener('pointermove', this.onMouseMove);
    document.addEventListener('pointerup', this.onMouseUp);

    this.thumbElem.ondragstart = function() {
      return false;
    };
  }

  moveAt(pageX, pageY) {
    this.thumbElem.style.left = pageX - this.shiftX + 'px';
    this.thumbElem.style.top = pageY - this.shiftY + 'px';
  }

  onMouseMove = ({clientX, clientY}) => {
    this.moveAt(clientX, clientY);

    const prevElem = this.emptyBlock.previousElementSibling;
    const nextElem = this.emptyBlock.nextElementSibling;

    const { firstElementChild, lastElementChild } = this.element;
    const { top: firstElementTop } = firstElementChild.getBoundingClientRect();
    const { bottom } = this.element.getBoundingClientRect();

    if (clientY < firstElementTop) {
      return firstElementChild.before(this.emptyBlock);
    }

    if (clientY > bottom) {
      return lastElementChild.after(this.emptyBlock);
    }

    if (prevElem) {
      const { top, height } = prevElem.getBoundingClientRect();
      const middlePrevElem = top + height / 2;

      if (clientY < middlePrevElem) {
        return prevElem.before(this.emptyBlock);
      }
    }

    if (nextElem) {
      const { top, height } = nextElem.getBoundingClientRect();
      const middleNextElem = top + height / 2;

      if (clientY > middleNextElem) {
        return nextElem.after(this.emptyBlock);
      }
    }
  }

  onThumbPointerUp() {
    this.thumbElem.classList.remove('sortable-list__item_dragging');
    this.thumbElem.style.cssText = '';
    this.emptyBlock.replaceWith(this.thumbElem);
    this.thumbElem = null;

    document.removeEventListener('pointermove', this.onMouseMove);
    document.removeEventListener('pointerup', this.onMouseUp);
  }

  onMouseUp = () => {
    this.onThumbPointerUp();
  };

  render() {
    const element = document.createElement("ul");
    element.classList.add('sortable-list');
    element.dataset.element = 'list',
    element.innerHTML = this.getTemplate();
    this.element = element;

    this.subElements = this.getSubElements(this.element);
    return this.element;
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
