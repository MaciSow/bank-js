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
        this.fillTable(this.makeTransactionList());
        this.listenSortClick();
    }


    fillTable(transactionList) {
        this.tableBody.innerHTML = this.generateTableBody(transactionList);
    }

    makeTransactionList() {
        let transactionItems = [];
        this.accounts.forEach(account => {
            account.transactions.forEach(transaction => {
                transactionItems.push({
                    accountNumber: account.accountNumber,
                    amount: transaction.amount,
                    date: transaction.date
                });
            })
        })
        return transactionItems;
    }

    generateTableBody(transactionItems) {
        let htmlBody = '';
        transactionItems.forEach(item => htmlBody += this.generateRow(item))
        return htmlBody;
    }

    generateRow(data) {
        return `<tr>
        <td>${data.accountNumber}</td>
        <td>${data.amount}</td>
        <td>${shortFormatDate(data.date)}</td>
        </tr>`
    }

    listenSortClick() {
        const buttons = historyContainer.querySelectorAll('.js-sort-transaction');
        buttons.forEach(item => item.addEventListener('click', evt => this.toggleSortDirection(evt)))
    }

    toggleSortDirection(evt) {
        const btn = evt.target;
        const sortColumn = btn.dataset.columnSort;
        const sortDirection = btn.dataset.sortDirection || null;
        const sortingData = this.makeTransactionList();

        this.resetSortDirections();

        switch (sortDirection) {
            case 'down':
                 break;
            case 'up':
                sortingData.sort((a, b) => b[sortColumn] - a[sortColumn]);
                btn.dataset.sortDirection = 'down';
                break;
            default:
                sortingData.sort((a, b) => a[sortColumn] - b[sortColumn]);
                btn.dataset.sortDirection = 'up';
        }
       
        this.fillTable(sortingData);
    }

    resetSortDirections() {     
        const allColumns = historyContainer.querySelectorAll('.js-sort-transaction');
        allColumns.forEach(item => item.dataset.sortDirection = '')
    }
}
