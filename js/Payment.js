import { toggleDisableBtn, roundNumber, slideUp, slideDown, slideToggle, collapseWithoutCurrent } from "./utilities.js";
import { Transaction } from "./Transaction.js";

export class Payment {
    paymentSection = document.querySelector('#paymentContainer');
    inputSelect = this.paymentSection.querySelector('#accountNumberSelect');
    inputAmount = this.paymentSection.querySelector('#paymentAmount');
    submitBtn = this.paymentSection.querySelector('#paymentSubmit');
    isSelected = false;
    isAmount = false;
    wait = collapseWithoutCurrent('actionContainer', this.paymentSection);
    accounts = [];


    init(accounts) {
        this.accounts = accounts;
        this.inputSelect.addEventListener('change', this.changeAccount.bind(this));
        this.inputAmount.addEventListener('input', this.changeAmount.bind(this));
        this.submitBtn.addEventListener('click', this.submit.bind(this));
    }

    show() {
        this.clear();
        this.fillAccountList();
        setTimeout(() => {
            slideToggle(this.paymentSection);
        }, this.wait ? 250 : 0)
    }

    clear() {
        this.inputSelect.selectedIndex = 0;
        this.inputAmount.value = '';
        this.submitBtn.setAttribute('disabled', true);
        this.inputAmount.classList.remove('is-invalid');
        this.inputSelect.innerHTML = null;
        this.inputSelect.innerHTML = `<option value="0" selected>Select Account Number...</option>`;
        this.isSelected = false;
        this.isAmount = false;
    }

    fillAccountList() {
        this.accounts.forEach(item => {
            let option = `<option value="${item.accountNumber}">${item.accountNumber}</option>`;
            this.inputSelect.innerHTML += option;
        });
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
        const account = this.accounts.find(item => String(item.accountNumber) == accountNumber);

        if (amountValue > account.balance + account.debit) {
            this.inputAmount.classList.add('is-invalid');
            this.submitBtn.setAttribute('disabled', true);
            this.isSelected = true;
            return;
        }

        account.balance -= amountValue;
        const transaction = new Transaction(null, -amountValue);
        account.addTransaction(transaction);
        account.rebuildTransactions();
        slideUp(this.paymentSection);
    }
}