import {Account} from "./Account";

export function shortFormatDate(date) {
    return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}
    ${addZero(date.getHours())}:${addZero(date.getMinutes())}`
}

export function toFileFormatDate(date) {
    return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}T${addZero(date.getHours())}:${addZero(date.getMinutes())}`
}

export function toggleDisableBtn(btn, condition1, condition2) {
    if (condition1 && condition2) {
        btn.removeAttribute('disabled');
    } else {
        btn.setAttribute('disabled', 'true');
    }
}

export function roundNumber(amount) {
    return Math.floor(amount * 100) / 100;
}

export function formatAmount(amount) {
    let number = +amount;
    return number.toFixed(2);
}

function addZero(txt) {
    txt = String(txt).length === 1 ? `0${txt}` : txt;
    return txt;
}

export function slideUp(element) {
    const maxHeight = element.firstElementChild.offsetHeight;
    const time = 250;
    let timer = null;

    element.classList.remove('is-open');
    element.style.height = maxHeight + 'px';

    clearInterval(timer);

    const instanceHeight = parseInt(element.style.height);
    const init = (new Date()).getTime();
    const height = 0;
    const display = height - parseInt(element.style.height);

    timer = setInterval(() => {

        let instance = (new Date()).getTime() - init;
        if (instance <= time) {
            let pos = instanceHeight + Math.floor(display * instance / time);
            element.style.height = pos + 'px';
        } else {
            element.removeAttribute('style')
            clearInterval(timer);
        }
    }, 20);
}

export function slideDown(element) {
    element.classList.add('is-open');
    element.style.height = '0px';

    const maxHeight = element.firstElementChild.offsetHeight;
    const time = 250;
    let timer = null;

    clearInterval(timer);

    const instanceHeight = parseInt(element.style.height);
    const init = (new Date()).getTime();
    const display = maxHeight - parseInt(element.style.height);

    timer = setInterval(() => {

        let instance = (new Date()).getTime() - init;
        if (instance <= time) {
            let pos = instanceHeight + Math.floor(display * instance / time);
            element.style.height = pos + 'px';
        } else {
            element.style.height = '100%';
            clearInterval(timer);
        }
    }, 20);
}

export function slideToggle(element) {
    const slider = element;
    const isOpen = element.style.height === '100%'
    const maxHeight = element.firstElementChild.offsetHeight;
    const time = 250;
    let timer = null;
    clearInterval(timer);

    const init = (new Date()).getTime();
    let height = isOpen ? 0 : maxHeight;

    if (isOpen) {
        element.classList.remove('is-open');
        slider.style.height = maxHeight + 'px';
    } else {
        element.classList.add('is-open');
        slider.style.height = '0px';
    }

    const instanceHeight = parseInt(slider.style.height);
    const display = height - parseInt(slider.style.height);

    timer = setInterval(() => {
        let instance = (new Date()).getTime() - init;
        if (instance <= time) {
            let pos = instanceHeight + Math.floor(display * instance / time);
            slider.style.height = pos + 'px';
        } else {
            isOpen ? slider.removeAttribute('style') : slider.style.height = '100%';
            clearInterval(timer);
        }
    }, 20);
}

export function slideReset(current) {
    const items = document.querySelectorAll('.js-slide-reset');
    let anyOpen = false;

    items.forEach(item => {
        if (item.classList.contains('is-open') && item !== current) {
            anyOpen = true;
            slideUp(item);
        }
    })
    setTimeout(() => {
        if (current) {
            slideToggle(current);
        }
    }, anyOpen ? 250 : 0)
}

export function fillAccountList(accounts, inputSelect) {
    accounts.forEach(item => {
        let option = `<option value="${item.accountNumber}">${Account.formatAccountNumber(item.accountNumber)}</option>`;
        inputSelect.innerHTML += option;
    });
}

export function clearAccountList(inputSelect, direction) {
    inputSelect.selectedIndex = 0;
    inputSelect.innerHTML = null;
    inputSelect.innerHTML = `<option value="0" selected>Select ${direction} Account Number...</option>`;
}

export function generateFile(accounts) {
    let content = '';
    accounts.forEach(account => {
        content += account.toString();
        content += '########################################\n'
    })
    return content;
}