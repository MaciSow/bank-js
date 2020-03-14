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

export function slideDown(element) {

    element.style.height = '0px';

    const maxheight = element.firstElementChild.offsetHeight;
    const time = 500;
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
    }, 25);
}

export function slideToggle(element) {
    const slider = element;
    const isOpen = element.style.height === '100%'
    const maxheight = element.firstElementChild.offsetHeight;
    const time = 500;
    let timer = null;
    clearInterval(timer);

    const init = (new Date()).getTime();
    let height = isOpen ? 0 : maxheight;

    if (isOpen) {
        slider.style.height = maxheight + 'px';
    } else {
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
    }, 25);
}