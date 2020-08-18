import { roundNumber, shortFormatDate, formatAmount, toFileFormatDate, } from "./utilities";


export class Transaction {
    date = '';
    amount = null;

    constructor(date, amount) {
        this.date = date || new Date();
        this.amount = roundNumber(amount);
    }

    show() {
        console.log(`date: ${this.date} amount: ${this.amount}`);
    }

    toString() {
        return `${toFileFormatDate(this.date)} ${this.amount > 0 ? '+' : ''}${formatAmount(this.amount)}`
    }

    generateHtmlTransaction() {
        const shortDate = shortFormatDate(this.date);
        const amount = formatAmount(this.amount);
        return `<li>
                    <i class="far fa-calendar"></i>
                    ${shortDate}
                    <span class="u-ml--sm">
                        <i class="fas fa-money-bill-wave "></i>
                        ${amount}
                    </span>
                </li>`
    }

}
