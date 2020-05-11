import { roundNumber, slideUp, slideReset, fillAccountList, clearAccountList } from "./utilities.js";
import { Transaction } from "./Transaction.js";

export class Transfer {
    transferContainer = document.querySelector('#transferContainer');
    senderAccNumSelect = this.transferContainer.querySelector('#senderAccNumSelect');
    receiverAccNumSelect = this.transferContainer.querySelector('#receiverAccNumSelect');
    transferAmount = this.transferContainer.querySelector('#transferAmount');
    transferSubmit = this.transferContainer.querySelector('#transferSubmit');
    inputTransferGroup = this.transferContainer.querySelector('.input-group');
    senderSelectedAccount;
    accounts = [];

    init(accounts) {
        this.accounts = accounts;
        this.senderAccNumSelect.addEventListener('change', this.changeSenderAccount.bind(this))
        this.receiverAccNumSelect.addEventListener('change', this.changeReceiverAccount.bind(this))
        this.transferAmount.addEventListener('input', this.inputTransferAmount.bind(this))
        this.transferSubmit.addEventListener('click', this.submit.bind(this))
    }

    show() {
        this.clear();
        fillAccountList(this.accounts, this.senderAccNumSelect);
    }

    clear() {
        slideReset(this.transferContainer);
        clearAccountList(this.senderAccNumSelect, 'Sender')
        this.transferAmount.value = null;
        this.receiverAccNumSelect.classList.add('u-hide');
        this.transferSubmit.classList.add('u-hide');
        this.inputTransferGroup.classList.add('u-hide');
    }

    changeSenderAccount() {
        this.senderSelectedAccount = +this.senderAccNumSelect.selectedOptions[0].value;
        this.inputTransferGroup.classList.add('u-hide');

        if (this.senderSelectedAccount === 0) {
            this.receiverAccNumSelect.classList.add('u-hide');
            return;
        }

        this.receiverAccNumSelect.classList.remove('u-hide');
        clearAccountList(this.receiverAccNumSelect, 'Receiver')

        const receiverAccounts = this.accounts.filter(item => item.accountNumber !== this.senderSelectedAccount);
        fillAccountList(receiverAccounts, this.receiverAccNumSelect);
    }

    changeReceiverAccount() {
        const receiverSelectedAccount = +this.receiverAccNumSelect.selectedOptions[0].value;

        if (receiverSelectedAccount === 0) {
            this.inputTransferGroup.classList.add('u-hide');
            return;
        }
        this.inputTransferGroup.classList.remove('u-hide');
        this.transferAmount.value = '';
    }

    inputTransferAmount() {
        this.transferAmount.classList.remove('is-invalid');

        if (this.transferAmount.value !== '' && this.transferAmount.value > 0) {
            this.transferSubmit.classList.remove('u-hide');
        }
        else {
            this.transferSubmit.classList.add('u-hide');
        }

        const account = this.accounts.find(item => item.accountNumber == this.senderSelectedAccount);

        if (account.balance + account.debit < this.transferAmount.value) {
            this.transferAmount.classList.add('is-invalid');
            this.transferSubmit.classList.add('u-hide');
        }
    }

    submit() {
        const senderAccountNumber = this.senderAccNumSelect.selectedOptions[0].value;
        const receiverAccountNumber = this.receiverAccNumSelect.selectedOptions[0].value;

        const senderAccount = this.accounts.find(item => String(item.accountNumber) == senderAccountNumber);
        const receiverAccount = this.accounts.find(item => String(item.accountNumber) == receiverAccountNumber);

        const amountValue = roundNumber(this.transferAmount.value);

        senderAccount.balance -= amountValue;
        const senderTransaction = new Transaction(null, -amountValue);
        senderAccount.addTransaction(senderTransaction);
        senderAccount.rebuildTransactions();

        receiverAccount.balance += amountValue;
        const receiverTransaction = new Transaction(null, amountValue);
        receiverAccount.addTransaction(receiverTransaction);
        receiverAccount.rebuildTransactions();
        slideUp(this.transferContainer);
    }
}