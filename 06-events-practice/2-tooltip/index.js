class Tooltip {
  element;

  static instance = null;
  constructor(){
      if(!Tooltip.instance){
        Tooltip.instance = this;
      } else {
        return Tooltip.instance;
      }
  }

  initialize () {
    const moveEvent = (event) => {
      this.element.style.left = event.pageX + 10 + 'px';
      this.element.style.top = event.pageY + 10 + 'px';
    };

    document.addEventListener('pointerover', (event) => {
      if (event.target.dataset.tooltip != undefined) {
        this.render(event.target.dataset.tooltip);
        document.addEventListener('mousemove', moveEvent );
      }
    });

    document.addEventListener('pointerout', (event) => {
      if (event.target.dataset.tooltip != undefined) {
        this.remove();
        document.removeEventListener('mousemove', moveEvent);
      }
    });
  }

  getTemplate(text) {
    return `<div class="tooltip">${text}</div>`
  }

  render(text) {
    const element = document.createElement("div");
    element.innerHTML = this.getTemplate(text);
    this.element = element.firstElementChild;
    document.body.append(this.element);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

export default Tooltip;
