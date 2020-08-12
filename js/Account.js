import { slideToggle } from "./utilities.js";
import { Transaction } from "./Transaction.js";

export class Account {
    accountNumber = '';
    name = '';
    surname = '';
    balance = null;
    debit = null;
    transactions = [];

    constructor(accountNumber, name, surname, balance, debit, transactions) {
        this.accountNumber = accountNumber;
        this.name = name;
        this.surname = surname;
        this.balance = balance;
        this.debit = debit;
        this.transactions = transactions || [];
    }

    show() {
        console.log(`accountNumber: ${accountNumber} 
        name: ${name}  
        surname: ${surname} 
        balance ${balance}
        debit ${debit}
        transactions ${transactions}`);
    }

    toString() {
        let transactionsString = '';
        this.transactions.forEach(item => {
            transactionsString += item.toString() + '\n';
        });

        return `${this.accountNumber} ${this.name} ${this.surname} ${this.balance > 0 ? '+' : ''}${this.balance} ${this.debit}\n${transactionsString}`
    }

    addTransaction(transaction) {
        this.transactions.push(transaction);
    }

    generateHtmlAccount() {
        let transactionItems = '';

        this.transactions.forEach(item => {
            const transaction = new Transaction(item.date, item.amount)

            transactionItems += transaction.generateHtmlTransaction();
        });

        return `<li id="nr${this.accountNumber}" class="account__item">
                    <div class="account__header">
                        <span>${Account.formatAccountNumber(this.accountNumber)}</span> 
                        <span><i class="fas fa-user"></i>  ${this.name} ${this.surname}</span> 
                        <span class="${this.balance < 0 ? 'u-warning' : 'account__balance'}">${this.balance}${this.balance < 0 ? ' <i class="fas fa-exclamation"></i>' : ''}</span> 
                        <span>${this.debit}</span> 
                    </div>
                    <div class="slide">
                        <ol class="account__transactions">${transactionItems}</ol>
                    </div>
                </li>`;
    }

    rebuildTransactions() {
        let accountHtml = document.querySelector('#nr' + this.accountNumber)

        accountHtml.outerHTML = this.generateHtmlAccount();
        accountHtml = document.querySelector('#nr' + this.accountNumber);

        accountHtml.addEventListener('click', (evt) => {
            const elem = evt.currentTarget.querySelector('.slide');

            slideToggle(elem);
        });
    }

    static formatAccountNumber(accountNumber) {
        return `${accountNumber.substr(0, 2)} ${accountNumber.substr(2, 4)} ${accountNumber.substr(6, 4)} ${accountNumber.substr(10, 4)} ${accountNumber.substr(14, 4)} ${accountNumber.substr(18, 4)} ${accountNumber.substr(22, 4)}`
    }

    hasEnoughMoney(amount) {
        return this.balance + this.debit >= amount 
    }
}