import { slideReset, shortFormatDate } from "./utilities.js";
import { Transaction } from "./Transaction.js";

export class History {
    historyContainer = document.querySelector('#historyContainer');
    tableBody = historyContainer.querySelector('.js-table-body');

    accounts = [];

    init(accounts) {
        this.accounts = accounts;
    }

    show() {
        slideReset(this.historyContainer);
        this.fillTable();
    }

    fillTable() {
        this.tableBody.innerHTML = this.generateTableBody();
        console.log('generateTableBody: ', this.generateTableBody());

    }

    generateTableBody() {
        let transactionItems = '';
        this.accounts.forEach(account => {
            account.transactions.forEach(transaction => {
                const data = {
                    accountNumber: account.accountNumber,
                    amount: transaction.amount,
                    date: shortFormatDate(transaction.date)
                };
                transactionItems += this.generateRow(data);
            })
        })
        return transactionItems;
    }

    generateRow(data) {
        return `<tr>
        <td>${data.accountNumber}</td>
        <td>${data.amount}</td>
        <td>${data.date}</td>
        </tr>`
    }
}