import { slideReset, shortFormatDate, formatAmount } from "./utilities.js";
import { Transaction } from "./Transaction.js";
import { Account } from "./Account.js";

export class History {
    historyContainer = document.querySelector('#historyContainer');
    tableBody = historyContainer.querySelector('.js-table-body');
    filterInput = historyContainer.querySelector('.js-filter');

    accounts = [];
    filteredTransactionList = []

    init(accounts) {
        this.accounts = accounts;
    }

    show() {
        slideReset(this.historyContainer);
        this.filteredTransactionList = this.makeTransactionList();
        console.log('this.filteredTransactionList: ', this.filteredTransactionList);
        this.fillTable(this.filteredTransactionList);
        this.listenSortClick();
        this.filterInput.addEventListener('input', this.filterTable.bind(this))
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

    listenSortClick() {
        const buttons = historyContainer.querySelectorAll('.js-sort-transaction');
        buttons.forEach(item => item.addEventListener('click', evt => this.toggleSortDirection(evt)))
    }

    toggleSortDirection(evt) {
        const btn = evt.currentTarget;
        const sortColumn = btn.dataset.columnSort;
        const sortDirection = btn.dataset.sortDirection || null;
        let sortingData = [...this.filteredTransactionList];

        this.resetSortDirections();

        switch (sortDirection) {
            case 'down':
                break;
            case 'up':
                this.sortTransactions(sortingData, sortColumn, 'down')
                // sortingData.sort((a, b) => b[sortColumn] - a[sortColumn]);
                btn.dataset.sortDirection = 'down';
                break;
            default:
                this.sortTransactions(sortingData, sortColumn, 'up')
                // sortingData.sort((a, b) => a[sortColumn] - b[sortColumn]);
                btn.dataset.sortDirection = 'up';
        }
        // this.filteredTransactionList = sortingData;
        this.fillTable(sortingData);
        this.addArrow(btn.dataset.sortDirection, btn);
    }

    sortTransactions(transactions, property, direction) {
        switch (direction) {
            case 'up':
                transactions.sort((a, b) => a[property] - b[property]);
                break;
            case 'down':
                transactions.sort((a, b) => b[property] - a[property]);
                break;
            default:
        }
    }

    resetSortDirections() {
        const allColumns = historyContainer.querySelectorAll('.js-sort-transaction');
        allColumns.forEach(item => {
            item.dataset.sortDirection = '';
            this.removeArrow(item);
        });
    }

    filterTable() {
        const word = String(this.filterInput.value);
        let transactionList = this.makeTransactionList();

        const column = this.getColumnSort();
        if (column) {
            this.filteredTransactionList = this.makeTransactionList();
            transactionList = [...this.filteredTransactionList];
            this.sortTransactions(transactionList, column.dataset.columnSort, column.dataset.sortDirection);
        }
        if (word.length < 3) {
            this.fillTable(transactionList);
            return;
        }
        this.filteredTransactionList = this.filteredTransactionList.filter(element => {
            if (element.accountNumber.indexOf(word) > -1) {
                return true;
            }
            if (Account.formatAccountNumber(element.accountNumber).indexOf(word) > -1) {
                return true;
            }
            if (String(element.amount).indexOf(word) > -1) {
                return true;
            }
            if (shortFormatDate(element.date).indexOf(word) > -1) {
                return true;
            }
            return false;
        })
        transactionList = [...this.filteredTransactionList];
        if (column) {
            this.sortTransactions(transactionList, column.dataset.columnSort, column.dataset.sortDirection)
        }
        this.fillTable(transactionList);
    }

    getColumnSort() {
        const allColumns = historyContainer.querySelectorAll('.js-sort-transaction');
        let column;
        allColumns.forEach(item => {
            if (item.dataset.sortDirection === 'up' || item.dataset.sortDirection === 'down') {
                column = item;
            }
        })
        return column;
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

    fillTable(transactionList) {
        this.tableBody.innerHTML = this.generateTableBody(transactionList);
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
}
