import { slideReset, shortFormatDate, formatAmount } from "./utilities.js";
import { Transaction } from "./Transaction.js";
import { Account } from "./Account.js";

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
        <td>${Account.formatAccountNumber(data.accountNumber)}</td>
        <td class="${data.amount < 0 ? 'warning' : 'cashGood'}">${formatAmount(data.amount)}</td>
        <td>${shortFormatDate(data.date)}</td>
        </tr>`
    }

    listenSortClick() {
        const buttons = historyContainer.querySelectorAll('.js-sort-transaction');
        buttons.forEach(item => item.addEventListener('click', evt => this.toggleSortDirection(evt)))
    }

    toggleSortDirection(evt) {
        const btn = evt.currentTarget;
        const sortColumn = btn.dataset.columnSort;
        const sortDirection = btn.dataset.sortDirection || null;
        const sortingData = this.makeTransactionList();

        this.resetSortDirections(btn);

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
        this.addArrow(btn.dataset.sortDirection, btn);
    }

    resetSortDirections(curentColumn) {
        const allColumns = historyContainer.querySelectorAll('.js-sort-transaction');
        allColumns.forEach(item => {
            item.dataset.sortDirection = '';
            this.removeArrow(item);
        });
    }

    addArrow(sortDirection, element) {
        const arrowIco = `<i class="fas fa-arrow-up"></i>`;

        switch (sortDirection) {
            case 'up':
                element.insertAdjacentHTML('beforeend', arrowIco);
                break;
            case 'down':
                element.insertAdjacentHTML('beforeend', arrowIco)
                element.querySelector('.fa-arrow-up').classList.add('fa-rotate-180');
                break;
            default:
                this.removeArrow(element);
        }
    }

    removeArrow(element) {
        const arrow = element.querySelector('.fa-arrow-up');
        if (arrow) {
            const elementTxt = element.textContent;
            element.textContent = elementTxt;
        }
    }
}
