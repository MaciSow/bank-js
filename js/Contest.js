import { slideReset, slideDown } from "./utilities.js";
const LOTTERY_COST = 1500;

export class Contest {
    contestContainer = document.querySelector('#contestContainer');
    playerList = contestContainer.querySelector('.js-player-list');
    drawContainer = contestContainer.querySelector('.js-contest-draw');
    btnDraw = contestContainer.querySelector('#btnDraw');
    winnerContainer = contestContainer.querySelector('.js-winners');
    winnerList = this.winnerContainer.querySelector('.js-winner-list');

    accounts = [];


    show(accounts) {
        slideReset(this.contestContainer);
        this.accounts = accounts;
        this.makeList();
        this.btnDraw.addEventListener('click', () => {
            const drawnNumbers = this.drawNumbers();
            this.compareNumbers(drawnNumbers);
            slideDown(this.winnerContainer);
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

            htmlPlayer += ` <li class="item js-player" data-account="${account.accountNumber}">
                                <span class="col-left ${notPlay}">G${number} ${account.name}</span>
                                <span class="col-right">${notPlay ? '' : numberList}</span>
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
        htmlNumbers = `<span class="u-d-flex"> ${numberList}</span>`;

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
        const players = this.playerList.querySelectorAll('.js-player');

        players.forEach(player => {
            const balls = player.querySelectorAll('.js-ball');
            let hitBalls = [];

            balls.forEach(ball => {
                if (drawnNumbers.find(item => item === +(ball.innerText))) {
                    ball.classList.add('ball--yellow');
                    hitBalls.push(ball);
                }
            })

            this.generateWinnerList(player, hitBalls);
        })
    }

    generateWinnerList(player, hitBalls) {
        const name = player.children[0].innerText.substr(3);
        let htmlWinner = '<span class="u-warning">NOOBS!!!</span>';

        if (hitBalls.length > 2) {
            let htmlBalls = '';
            htmlWinner = '';

            hitBalls.forEach(ball => {
                htmlBalls += ball.outerHTML;
            })

            htmlWinner += `<li class="item">
                             <span class="col-left">${name}</span>
                             <span class="col-right">
                             <span class="u-d-flex-center u-mr--sm">hits</span>
                             ${htmlBalls}</span>
                            </li>`;

        }
        this.winnerList.innerHTML = null;
        this.winnerList.insertAdjacentHTML('beforeend', htmlWinner)
    }
}

