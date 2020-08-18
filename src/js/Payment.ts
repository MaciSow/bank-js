import {clearAccountList, fillAccountList, roundNumber, slideReset, slideUp, toggleDisableBtn} from "./utilities";
import {Notification} from "./Notification";

export class Payment {
    paymentContainer = document.querySelector('#paymentContainer') as HTMLDivElement;
    inputSelect = this.paymentContainer.querySelector('#accountNumberSelect') as HTMLSelectElement;
    inputAmount = this.paymentContainer.querySelector('#paymentAmount') as HTMLInputElement;
    submitBtn = this.paymentContainer.querySelector('#paymentSubmit') as HTMLButtonElement;
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
        this.submitBtn.setAttribute('disabled', 'true');
        this.inputAmount.classList.remove('is-invalid');
        this.isSelected = false;
        this.isAmount = false;
    }

    changeAccount() {
        this.isSelected = +this.inputSelect.selectedOptions[0].value !== 0;
        toggleDisableBtn(this.submitBtn, this.isSelected, this.isAmount);
    }

    changeAmount() {
        this.isAmount = (this.inputAmount.value !== '' && +this.inputAmount.value > 0);
        this.inputAmount.classList.remove('is-invalid');
        toggleDisableBtn(this.submitBtn, this.isSelected, this.isAmount);
    }

    submit() {
        const accountNumber = this.inputSelect.selectedOptions[0].value;
        const amountValue = roundNumber(this.inputAmount.value);
        const account = this.accounts.find(item => item.accountNumber == accountNumber);

        if (amountValue > account.balance + account.debit) {
            this.inputAmount.classList.add('is-invalid');
            this.submitBtn.setAttribute('disabled', 'true');
            this.isSelected = true;
            return;
        }

        account.doPayment(amountValue);
        slideUp(this.paymentContainer);
        new Notification('Payment');
    }
}