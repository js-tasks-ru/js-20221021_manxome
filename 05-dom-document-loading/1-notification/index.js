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

        this.container = document.body;
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }

    show(div = this.container) {
        if (this.container.querySelector('.notification')) {
            this.container.querySelector('.notification').remove();
        }

        div.append(this.element);
        setTimeout(() =>  this.remove(), this.duration);
    }
}
