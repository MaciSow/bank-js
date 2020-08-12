import { slideReset } from "./utilities.js";
const LOTTERY_COST = 1500;

export class Contest {
    contestContainer = document.querySelector('#contestContainer');
    playerList = contestContainer.querySelector('.js-player-list');
    drawContainer = contestContainer.querySelector('.js-contest-draw');
    btnDraw = contestContainer.querySelector('#btnDraw');

    accounts = [];


    show(accounts) {
        slideReset(this.contestContainer);
        this.accounts = accounts;
        this.makeList();
        this.btnDraw.addEventListener('click', () => {
            const drawnNumbers = this.drawNumbers();
            this.compareNumbers(drawnNumbers);
        });
    }

    makeList() {
        let htmlPlayer = '';
        let number = 1;

        this.accounts.forEach((account, i) => {
            const notPlay = account.hasEnoughMoney(LOTTERY_COST) ? '' : 'strikethrough';
            const numbers = this.generateRandomNumbers(6).sort((a, b) => a - b);

            let numberList = '';
            numbers.forEach(element => numberList += `<span class="ball js-ball">${element}</span>`);

            htmlPlayer += ` <li class="player-list__item">
                                <span class="col-left ${notPlay}">G${number} ${account.name}</span>
                                <div class="u-d-flex">${notPlay ? '' : numberList}</div>
                            </li>`;

            notPlay ? null : number++;
        });
        this.playerList.innerHTML = null;
        this.playerList.insertAdjacentHTML('beforeend', htmlPlayer)
    }

    drawNumbers() {
        let numberList = '';
        let htmlNumbers = '';
        const numbers = this.generateRandomNumbers(6).sort((a, b) => a - b);

        numbers.forEach(element => numberList += `<span class="ball ball--yellow">${element}</span>`);
        htmlNumbers = `<div class="u-d-flex"> ${numberList}</div>`;

        this.btnDraw.classList.add('u-hide');

        this.drawContainer.insertAdjacentHTML('beforeend', htmlNumbers)

        return numbers;
    }

    generateRandomNumbers(quantity, start = 1, end = 49) {
        let numbers = [];

        if (quantity >= end) {
            return;
        }

        while (numbers.length < quantity) {
            const number = Math.floor(Math.random() * (end - start + 1)) + start;
            numbers.indexOf(number) === -1 ? numbers.push(number) : null;
        }

        return numbers;
    }

    compareNumbers(drawnNumbers) {
        const balls = this.playerList.querySelectorAll('.js-ball');
        console.log('balls: ', balls);

        balls.forEach(ball => {
            if(drawnNumbers.find(item => item === +(ball.innerText))){
                ball.classList.add('ball--yellow');
            }
           
        })
    }
}