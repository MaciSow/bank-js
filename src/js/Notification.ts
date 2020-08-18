export class Notification {
    constructor(messageTxt) {
        Notification.insert(messageTxt);
        const notification = document.querySelector('.notification');
        setTimeout(() => notification.classList.add('show'), 250);
        setTimeout(() => Notification.remove(notification), 2000);
    }

    static insert(messageTxt) {
        const html = Notification.create(messageTxt);
        document.body.insertAdjacentHTML('beforeend', html)
    }

    static create(messageTxt) {
        return `<div class="notification">
                    <i class="fas fa-check notification__check"></i>
                    ${messageTxt} is successfully
                </div>`
    }

    static remove(notification) {
        if (notification) {
            notification.setAttribute('style', 'transition: 500ms opacity ease-in-out;');
            notification.classList.add('hide');
            setTimeout(() => notification.parentElement.removeChild(notification), 550);
        }
    }
}