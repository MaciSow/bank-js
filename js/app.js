import { toggleDisableBtn, roundNumber, slideDown, slideToggle } from "./utilities.js";
import { Transaction } from "./Transaction.js";
import { Account } from "./Account.js";

let accounts = [];
let bankDataInput = document.querySelector('#bankDataInput');
const btnPayment = document.querySelector('#btnPayment');
const btnTransfer = document.querySelector('#btnTransfer');
const btnHistory = document.querySelector('#btnHistory');
const btnContest = document.querySelector('#btnContest');

bankDataInput.addEventListener('change', () => {
    let input = bankDataInput;
    let file = input.files[0];

    accounts = readData(file);

    setTimeout(() => {
        const actionContainer = document.querySelector('#actionContainer');
        slideDown(actionContainer);
        generateAccountList(accounts);
    }, 0);
});

btnPayment.addEventListener('click', paymentAction);

btnTransfer.addEventListener('click', paymentAction);


function generateAccountList(accounts) {
    let accountItems = '';
    const container = document.querySelector('#accountList');
    const detailsContainer = document.querySelector('#detailsContainer');

    accounts.forEach(account => accountItems += account.generateHtmlAccount());
    container.innerHTML = accountItems;
    slideDown(detailsContainer);

    const items = detailsContainer.querySelectorAll('.account__item');
    items.forEach(item => {
        item.addEventListener('click', (evt) => {
            const elem = evt.currentTarget.querySelector('.slide');

            slideToggle(elem);
        });
    })
}

function readData(file) {
    let accounts = [];
    let reader = new FileReader();

    reader.onload = function () {
        let text = reader.result;
        let tmp = text.split('########################################')

        for (let i = 0; i < tmp.length - 1; i++) {
            const item = tmp[i];
            let lines = item.split('\n')
            lines = lines.filter(item => item !== "" && item.charCodeAt(0) !== 13);
            let userData = lines[0].split(' ');
            const account = new Account(+userData[0], userData[1], userData[2], +userData[3], +userData[4], null)

            for (let j = 1; j < lines.length - 1; j++) {
                const transactionData = lines[j].split(' ');
                const transaction = new Transaction(new Date(transactionData[0]), +transactionData[1])

                account.addTransaction(transaction);
            }

            accounts.push(account);
        }
    };
    reader.readAsText(file);
    return accounts;
}

function paymentAction() {
    const paymentSection = document.querySelector('#paymentContainer');
    const inputSelect = document.querySelector('#accountNumberSelect');
    const inputAmount = document.querySelector('#paymentAmount');
    const submitBtn = document.querySelector('#paymentSubmit');
    let isSelected = false;
    let isAmount = false;

    slideToggle(paymentSection);

    inputSelect.selectedIndex = 0;
    inputAmount.value = '';
    submitBtn.setAttribute('disabled', true);
    inputAmount.classList.remove('is-invalid');
    inputSelect.innerHTML = null;
    inputSelect.innerHTML = `<option selected>Select Account Number...</option>`;

    accounts.forEach(item => {
        let option = `<option value="${item.accountNumber}">${item.accountNumber}</option>`;
        inputSelect.innerHTML += option;
    });

    inputSelect.addEventListener('change', () => {
        isSelected = inputSelect.selectedOptions[0].value !== 'Select Account Number...';
        toggleDisableBtn(submitBtn, isSelected, isAmount);
    });

    inputAmount.addEventListener('input', () => {
        isAmount = (inputAmount.value !== '' && inputAmount.value > 0);
        inputAmount.classList.remove('is-invalid');
        toggleDisableBtn(submitBtn, isSelected, isAmount);

    });

    submitBtn.addEventListener('click', () => {
        const accountNumber = inputSelect.selectedOptions[0].value;
        const amountValue = roundNumber(inputAmount.value);
        const account = accounts.find(item => item.accountNumber == accountNumber);
        let accountHtml = document.querySelector('#nr' + accountNumber);

        if (amountValue > account.balance + account.debit) {
            inputAmount.classList.add('is-invalid');
            submitBtn.setAttribute('disabled', true);
            isSelected = true;
            return;
        }

        account.balance -= amountValue;
        const transaction = new Transaction(null, -amountValue);
        account.addTransaction(transaction);

        accountHtml.outerHTML = account.generateHtmlAccount();
        accountHtml = document.querySelector('#nr' + accountNumber);

        accountHtml.addEventListener('click', (evt) => {
            const elem = evt.currentTarget.querySelector('.slide');

            slideToggle(elem);
        });

        inputSelect.selectedIndex = 0;
        inputAmount.value = '';
        submitBtn.setAttribute('disabled', true);
        isSelected = false;
        isAmount = false;
    });

}

