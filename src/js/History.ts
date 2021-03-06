import { slideReset, shortFormatDate, formatAmount } from "./utilities";
import { Account } from "./Account";

export class History {
    historyContainer = document.querySelector('#historyContainer') as HTMLDivElement;
    tableBody = this.historyContainer.querySelector('.js-table-body') as HTMLElement;
    filterInput = this.historyContainer.querySelector('.js-filter') as HTMLInputElement;

    accounts = [];
    filterWord = '';
    sortDirection = null;
    sortColumn = null;

    show(accounts) {
        slideReset(this.historyContainer);
        this.accounts = accounts;
        this.composeTransactionList();
        this.listenSortClick();
        this.listenFilterInput();
    }

    listenSortClick() {
        const buttons = this.historyContainer.querySelectorAll('.js-sort-transaction') as NodeListOf<HTMLButtonElement>;
        buttons.forEach(item => item.addEventListener('click', evt => this.toggleSortDirection(evt)))
    }

    listenFilterInput(){
        this.filterInput.addEventListener('input', this.composeTransactionList.bind(this))
    }

    composeTransactionList() {
        let transactionList = this.makeTransactionList();
        this.filterWord = String(this.filterInput.value);
       
        if (this.sortColumn) {
            this.sortTransactions(transactionList);
        }
        
        if (this.filterWord.length > 2) {
            transactionList = this.filterTable(transactionList);
        }

        this.tableBody.innerHTML = this.generateTableBody(transactionList);
    }

    toggleSortDirection(evt) {
        const btn = evt.currentTarget;
        this.sortColumn = btn.dataset.columnSort;
        this.sortDirection = btn.dataset.sortDirection || null;

        switch (this.sortDirection) {
            case 'down':
                this.sortDirection = null;
                break;
            case 'up':
                this.sortDirection = 'down';
                break;
            default:
                this.sortDirection = 'up';
        }

        this.resetSortDirections();
        btn.dataset.sortDirection = this.sortDirection;
        this.addArrow(btn);
        this.composeTransactionList();
    }

    sortTransactions(transactionList) {
        switch (this.sortDirection) {
            case 'up':
                transactionList.sort((a, b) => a[this.sortColumn] - b[this.sortColumn]);
                break;
            case 'down':
                transactionList.sort((a, b) => b[this.sortColumn] - a[this.sortColumn]);
                break;
            default:
        }
    }
    
    filterTable(transactionList) {  
        return transactionList.filter(element => {
            if (element.accountNumber.indexOf(this.filterWord) > -1) {
                return true;
            }
            if (Account.formatAccountNumber(element.accountNumber).indexOf(this.filterWord) > -1) {
                return true;
            }
            if (String(element.amount).indexOf(this.filterWord) > -1) {
                return true;
            }
            return shortFormatDate(element.date).indexOf(this.filterWord) > -1;

        })
    }
    
    resetSortDirections() {
        const allColumns = this.historyContainer.querySelectorAll('.js-sort-transaction') as NodeListOf<HTMLElement>;
        allColumns.forEach(item => {
            item.dataset.sortDirection = '';
            this.removeArrow(item);
        });
    }

    addArrow(element) {
        const arrowIco = `<i class="fas fa-arrow-up"></i>`;

        switch (this.sortDirection) {
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
        const elementTxt = element.textContent;
        if (arrow) {
            element.textContent = elementTxt;
        }
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
        <td class="${data.amount < 0 ? 'u-warning' : 'u-cashGood'}">${formatAmount(data.amount)}</td>
        <td>${shortFormatDate(data.date)}</td>
        </tr>`
    }
}
