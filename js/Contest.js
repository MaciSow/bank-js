import { slideReset, slideDown, slideUp, formatAmount, roundNumber, slideToggle } from "./utilities.js";
import { Transaction } from "./Transaction.js";

const LOTTERY_COST = 5;
const BALL_AMOUNT = 6
const LOTTERY_WIN = 1000000

export class Contest {
    contestContainer = document.querySelector('#contestContainer');
    playerList = contestContainer.querySelector('.js-player-list');
    drawContainer = contestContainer.querySelector('.js-contest-draw');
    drawResults = contestContainer.querySelector('.js-contest-draw-results');
    btnDraw = contestContainer.querySelector('#btnDraw');
    winnerContainer = contestContainer.querySelector('.js-winners');
    winnerList = this.winnerContainer.querySelector('.js-winner-list');

    accounts = [];
    players = [];

    constructor() {
        this.btnDraw.addEventListener('click', this.draw.bind(this));
    }

    show(accounts) {
        this.clear();

        if (this.contestContainer.classList.contains('is-open')) {
            return;
        }

        this.accounts = accounts;
        this.players = this.makeList();
    }

    clear() {
        slideReset(this.contestContainer);

        this.drawResults.innerHTML = null;
        this.winnerList.innerHTML = null;


        slideUp(this.winnerContainer);
        this.btnDraw.classList.remove('u-hide');
    }

    draw() {
        this.btnDraw.classList.add('u-hide');
        this.takeTicket(this.players);

        const drawnNumbers = this.drawNumbers();
        const winners = this.getWinners(drawnNumbers);

        this.calculateWinAmount(winners);
        this.generateWinnerList(winners);
        this.withdrawMoney(winners);

        slideDown(this.winnerContainer);
    }

    makeList() {
        let htmlPlayer = '';
        let number = 1;
        let players = [];

        this.accounts.forEach((account, i) => {
            const notPlay = account.hasEnoughMoney(LOTTERY_COST) ? '' : 'strikethrough';
            const numbers = this.generateRandomNumbers(6).sort((a, b) => a - b);

            let numberList = '';
            numbers.forEach(element => numberList += `<span class="ball js-ball">${element}</span>`);

            htmlPlayer += ` <li class="item js-player" data-account="${account.accountNumber}">
                                <span class="col-left ${notPlay}">G${number} ${account.name}</span>
                                <span class="col-right">${notPlay ? '' : numberList}</span>
                            </li>`;

            notPlay ? null : number++ && players.push(account);
        });

        this.playerList.innerHTML = null;
        this.playerList.innerHTML = htmlPlayer;

        return players;
    }

    drawNumbers() {
        let numberList = '';
        const numbers = this.generateRandomNumbers(BALL_AMOUNT).sort((a, b) => a - b);

        numbers.forEach(element => numberList += `<span class="ball ball--yellow">${element}</span>`);

        this.drawResults.innerHTML = numberList;

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

    getWinners(drawnNumbers) {
        const players = this.playerList.querySelectorAll('.js-player');
        let winners = [];

        players.forEach(player => {
            const balls = player.querySelectorAll('.js-ball');
            let hitBalls = [];

            balls.forEach(ball => {
                if (drawnNumbers.find(item => item === +(ball.innerText))) {
                    ball.classList.add('ball--yellow');
                    hitBalls.push(ball);
                }
            })

            if (this.checkWinner(hitBalls)) {
                winners.push(
                    {
                        account: player.dataset.account,
                        name: player.children[0].innerText.substr(3),
                        hitBalls: hitBalls,
                        prize: 0
                    });
            }
        })
        return winners
    }

    generateWinnerList(winners) {

        if (!winners.length) {
            this.winnerList.innerHTML = '<li class="u-warning">NOOBS!!!</li>';
            return;
        }

        let htmlWinner = '';

        winners.forEach(winner => {

            let htmlBalls = '';

            winner.hitBalls.forEach(ball => {
                htmlBalls += ball.outerHTML;
            })

            htmlWinner += `<li class="item">
                                 <span class="col-left">${winner.name}</span>
                                 <span class="u-d-flex-center u-mr--sm">hits</span>
                                 <span class="col-right">${htmlBalls}</span>
                                 <span class="u-cashGood u-bold">${winner.prize} !!!</span>
                                </li>`;
        })

        this.winnerList.innerHTML = htmlWinner;
    }

    checkWinner(hitBalls) {
        return hitBalls.length > 2;
    }

    withdrawMoney(winners) {
        winners.forEach(winner => {
            const account = this.accounts.find(item => item.accountNumber === winner.account);
            account.doPayment(winner.prize);
        });
    }

    takeTicket(players) {
        players.forEach(player => {
            player.doPayment(-LOTTERY_COST);
        });
    }

    calculateWinAmount(winners) {
        let prizeHight = [];

        for (let i = 3; i < 7; i++) {
            let quantity = winners.filter(winner => winner.hitBalls.length === i);

            prizeHight.push(quantity.length ? Math.ceil(LOTTERY_WIN * (i / 10 - 0.2) / quantity.length) : 0)
        }

        winners.forEach(winner => winner.prize = prizeHight[winner.hitBalls.length - 3]);
    }
}



