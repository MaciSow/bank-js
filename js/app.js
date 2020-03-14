import { toggleDisableBtn, roundNumber, slideDown, slideToggle } from "./utilities.js";
import { Transaction } from "./Transaction.js";
import { Account } from "./Account.js";

let accounts = [];

let bankDataInput = document.querySelector('#bankDataInput');

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

document.querySelector('#btnPayment').addEventListener('click', paymentAction);


function generateAccountList(accounts) {
    let container = document.querySelector('#accountList');
    let accountItems = '';

    accounts.forEach(account => {
        accountItems += account.generateHtmlAccount();
    });

    container.innerHTML = accountItems;

    const detailsContainer = document.querySelector('#detailsContainer');
    slideDown(detailsContainer);

    const items = document.querySelectorAll('.account__item');
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

    let select = document.querySelector('#accountNumberSelect');
    let amount = document.querySelector('#paymentAmount');
    let submitBtn = document.querySelector('#paymentSubmit');
    let isSelected = false;
    let isAmount = false;

    slideToggle(paymentSection);

    select.selectedIndex = 0;
    amount.value = '';
    submitBtn.setAttribute('disabled', true);
    amount.classList.remove('is-invalid');

    select.innerHTML = null;
    select.innerHTML = `<option selected>Select Account Number...</option>`;

    accounts.forEach(item => {
        let option = `<option value="${item.accountNumber}">${item.accountNumber}</option>`;
        select.innerHTML += option;
    });

    select.addEventListener('change', () => {
        isSelected = select.selectedOptions[0].value !== 'Select Account Number...'
        toggleDisableBtn(submitBtn, isSelected, isAmount)
    });

    amount.addEventListener('input', () => {
        isAmount = (amount.value !== '' && amount.value > 0);
        amount.classList.remove('is-invalid');
        toggleDisableBtn(submitBtn, isSelected, isAmount)
        console.log("test");
    });

    const paymentSubmit = document.querySelector('#paymentSubmit');


    paymentSubmit.addEventListener('click', () => {


        const inputSelect = document.querySelector('#accountNumberSelect');
        const inputAmount = document.querySelector('#paymentAmount');
        const accountNumber = inputSelect.selectedOptions[0].value;
        const amountValue = roundNumber(inputAmount.value);
        const account = accounts.find(item => item.accountNumber == accountNumber)


        if (amountValue > account.balance + account.debit) {
            inputAmount.classList.add('is-invalid');
            paymentSubmit.setAttribute('disabled', true);
            isSelected = true;
            return;
        }

        account.balance -= amountValue;
        const transaction = new Transaction(null, -amountValue)
        account.addTransaction(transaction);

        let accountHtml = document.querySelector('#nr' + accountNumber);

        accountHtml.outerHTML = account.generateHtmlAccount();


        accountHtml = document.querySelector('#nr' + accountNumber);


        accountHtml.addEventListener('click', (evt) => {
            const elem = evt.currentTarget.querySelector('.slide');

            slideToggle(elem);
        });


        inputSelect.selectedIndex = 0;
        inputAmount.value = '';
        paymentSubmit.setAttribute('disabled', true);

        isSelected = false;
        isAmount = false;
    });

}

