import { toggleDisableBtn, roundNumber, slideUp, slideReset, fillAccountList, clearAccountList } from "./utilities.js";
import { Transaction } from "./Transaction.js";
import { Notification } from "./Notification.js";

export class Payment {
    paymentContainer = document.querySelector('#paymentContainer');
    inputSelect = this.paymentContainer.querySelector('#accountNumberSelect');
    inputAmount = this.paymentContainer.querySelector('#paymentAmount');
    submitBtn = this.paymentContainer.querySelector('#paymentSubmit');
    isSelected = false;
    isAmount = false;
    accounts = [];

    constructor() {
        this.inputSelect.addEventListener('change', this.changeAccount.bind(this));
        this.inputAmount.addEventListener('input', this.changeAmount.bind(this));
        this.submitBtn.addEventListener('click', this.submit.bind(this));
    }

    show(accounts) {
        this.clear();
        this.accounts = accounts;
        fillAccountList(this.accounts, this.inputSelect);
    }

    clear() {
        slideReset(this.paymentContainer);
        clearAccountList(this.inputSelect, '')
        this.inputAmount.value = '';
        this.submitBtn.setAttribute('disabled', true);
        this.inputAmount.classList.remove('is-invalid');
        this.isSelected = false;
        this.isAmount = false;
    }

    changeAccount() {
        this.isSelected = +this.inputSelect.selectedOptions[0].value !== 0;
        toggleDisableBtn(this.submitBtn, this.isSelected, this.isAmount);
    }

    changeAmount() {
        this.isAmount = (this.inputAmount.value !== '' && this.inputAmount.value > 0);
        this.inputAmount.classList.remove('is-invalid');
        toggleDisableBtn(this.submitBtn, this.isSelected, this.isAmount);
    }

    submit() {
        const accountNumber = this.inputSelect.selectedOptions[0].value;
        const amountValue = roundNumber(this.inputAmount.value);
        const account = this.accounts.find(item => item.accountNumber == accountNumber);

        if (amountValue > account.balance + account.debit) {
            this.inputAmount.classList.add('is-invalid');
            this.submitBtn.setAttribute('disabled', true);
            this.isSelected = true;
            return;
        }

        account.balance = (account.balance * 100 - amountValue * 100) / 100;
        const transaction = new Transaction(null, -amountValue);
        account.addTransaction(transaction);
        account.rebuildTransactions();
        slideUp(this.paymentContainer);
        new Notification('Payment');
    }
}