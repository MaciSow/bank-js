import { slideDown, slideToggle, generateFile, slideReset, slideUp } from "./utilities.js";
import { Transaction } from "./Transaction.js";
import { Account } from "./Account.js";
import { Payment } from "./Payment.js";
import { Transfer } from "./Transfer.js";
import { History } from "./History.js";
import { Notification } from "./Notification.js";

let accounts = [];
let bankDataInput = document.querySelector('#bankDataInput');
const btnPayment = document.querySelector('#btnPayment');
const btnTransfer = document.querySelector('#btnTransfer');
const btnHistory = document.querySelector('#btnHistory');
const btnContest = document.querySelector('#btnContest');

const btnSave = document.querySelector('#btnSave');

const payment = new Payment();
const transfer = new Transfer();
const history = new History();


bankDataInput.addEventListener('change', () => {
    let input = bankDataInput;
    let file = input.files[0];

    accounts = readData(file);

    setTimeout(() => {
        const actionContainer = document.querySelector('#actionContainer');
        const detailsContainer = document.querySelector('#detailsContainer');

        if (accounts.length === 0) {
            console.log('test');
            btnSave.setAttribute('disabled', true);
            slideUp(actionContainer);
            slideUp(detailsContainer);
            return;
        }

        new Notification('File open')
        btnSave.removeAttribute('disabled');

        slideDown(actionContainer);
        generateAccountList(accounts);
        slideReset();
    }, 0);
});

btnPayment.addEventListener('click', () => payment.show(accounts));

btnTransfer.addEventListener('click', () => transfer.show(accounts));

btnHistory.addEventListener('click', () => history.show(accounts));

// btnContest.addEventListener('click', () => new Notification('schabowy'));

btnSave.addEventListener('click', saveData);

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
            const account = new Account(userData[0], userData[1], userData[2], +userData[3], +userData[4], null)


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

function saveData() {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(generateFile(accounts)));
    element.setAttribute('download', 'bank.txt');

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

