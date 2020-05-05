import { slideToggle } from "./utilities.js";
import { Transaction } from "./Transaction.js";

export class Account {
    accountNumber = null;
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
                        <span>${this.accountNumber}</span> 
                        <span><i class="fas fa-user"></i>  ${this.name} ${this.surname}</span> 
                        <span class="${this.balance < 0 ? 'warning' : 'account__balance'}">${this.balance}${this.balance < 0 ? ' <i class="fas fa-exclamation"></i>' : ''}</span> 
                        <span>${this.debit}</span> 
                    </div>
                    <div class="slide">
                        <ol class="account__transactions">${transactionItems}</ol>
                    </div>
                </li>`;
    }

    rebuildTransactions(){
        let accountHtml = document.querySelector('#nr' + this.accountNumber)

        accountHtml.outerHTML = this.generateHtmlAccount();
        accountHtml = document.querySelector('#nr' + this.accountNumber);

        accountHtml.addEventListener('click', (evt) => {
            const elem = evt.currentTarget.querySelector('.slide');

            slideToggle(elem);
        });
    }
}