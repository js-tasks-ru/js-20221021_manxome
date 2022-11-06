export default class NotificationMessage {
    constructor(message = "", {duration = 1000, type = 'success'} = {}) {
        this.message = message;
        this.duration = duration;
        this.type = type;

        this.render();
        this.initEventListeners();
    }

    getTemplate() {
        return `
            <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
                <div class="timer"></div>
                <div class="inner-wrapper">
                    <div class="notification-header">${this.type}</div>
                    <div class="notification-body">
                        ${this.message}
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

    initEventListeners() {
      // NOTE: в данном методе добавляем обработчики событий, если они есть
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

    show(div) {
        const self = this;
        const container = div || document.body;

        container.append(self.element);

        setTimeout(function() {
            self.remove();
        }, this.duration);
    }
}
