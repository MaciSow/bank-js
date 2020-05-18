import { Account } from "./Account.js";

export function shortFormatDate(date) {
    return `${date.getFullYear()}-${addZero(date.getMonth() + 1)}-${addZero(date.getDate())}
    ${addZero(date.getHours())}:${addZero(date.getMinutes())}`
}

export function toggleDisableBtn(btn, condition1, condition2) {
    if (condition1 && condition2) {
        btn.removeAttribute('disabled');
    }
    else {
        btn.setAttribute('disabled', true);
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
    const maxheight = element.firstElementChild.offsetHeight;
    const time = 250;
    let timer = null;

    element.classList.remove('is-open');
    element.style.height = maxheight + 'px';

    clearInterval(timer);

    const instanceheight = parseInt(element.style.height);
    const init = (new Date()).getTime();
    const height = 0;
    const disp = height - parseInt(element.style.height);

    timer = setInterval(() => {

        let instance = (new Date()).getTime() - init;
        if (instance <= time) {
            let pos = instanceheight + Math.floor(disp * instance / time);
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

    const maxheight = element.firstElementChild.offsetHeight;
    const time = 250;
    let timer = null;

    clearInterval(timer);

    const instanceheight = parseInt(element.style.height);
    const init = (new Date()).getTime();
    const height = maxheight;
    const disp = height - parseInt(element.style.height);

    timer = setInterval(() => {

        let instance = (new Date()).getTime() - init;
        if (instance <= time) {
            let pos = instanceheight + Math.floor(disp * instance / time);
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
    const maxheight = element.firstElementChild.offsetHeight;
    const time = 250;
    let timer = null;
    clearInterval(timer);

    const init = (new Date()).getTime();
    let height = isOpen ? 0 : maxheight;

    if (isOpen) {
        element.classList.remove('is-open');
        slider.style.height = maxheight + 'px';
    } else {
        element.classList.add('is-open');
        slider.style.height = '0px';
    }

    const instanceheight = parseInt(slider.style.height);
    const disp = height - parseInt(slider.style.height);

    timer = setInterval(() => {
        let instance = (new Date()).getTime() - init;
        if (instance <= time) {
            let pos = instanceheight + Math.floor(disp * instance / time);
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
        slideToggle(current);
    }, anyOpen ? 250 : 0)
}

export function fillAccountList(accounts, inputSelect){
    accounts.forEach(item => {
        let option = `<option value="${item.accountNumber}">${Account.formatAccountNumber(item.accountNumber)}</option>`;
        inputSelect.innerHTML += option;
    });
}

export function clearAccountList(inputSelect, direction){
    inputSelect.selectedIndex = 0;
    inputSelect.innerHTML = null;
    inputSelect.innerHTML = `<option value="0" selected>Select ${direction} Account Number...</option>`;
}