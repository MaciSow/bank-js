import { slideToggle } from "./utilities";
import { Transaction } from "./Transaction";

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
        console.log(`accountNumber: ${this.accountNumber} 
        name: ${this.name}  
        surname: ${this.surname} 
        balance ${this.balance}
        debit ${this.debit}
        transactions ${this.transactions}`);
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

    doPayment(amount){
        const transaction = new Transaction(null, amount);
        
        this.balance = (this.balance * 100 + transaction.amount * 100) / 100;
        this.addTransaction(transaction);
        this.rebuildTransactions();
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
            const target = evt.currentTarget as HTMLElement;
            const elem = target.querySelector('.slide');

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