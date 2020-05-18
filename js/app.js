import { toggleDisableBtn, roundNumber, slideUp, slideDown, slideToggle, slideReset } from "./utilities.js";
import { Transaction } from "./Transaction.js";
import { Account } from "./Account.js";
import { Payment } from "./Payment.js";
import { Transfer } from "./Transfer.js";
import { History } from "./History.js";

let accounts = [];
let bankDataInput = document.querySelector('#bankDataInput');
const btnPayment = document.querySelector('#btnPayment');
const btnTransfer = document.querySelector('#btnTransfer');
const btnHistory = document.querySelector('#btnHistory');
const btnContest = document.querySelector('#btnContest');

const payment = new Payment();
const transfer = new Transfer();
const history = new History();


bankDataInput.addEventListener('change', () => {
    let input = bankDataInput;
    let file = input.files[0];

    accounts = readData(file);
    payment.init(accounts);
    transfer.init(accounts);
    history.init(accounts);

    setTimeout(() => {
        const actionContainer = document.querySelector('#actionContainer');
        slideDown(actionContainer);
        generateAccountList(accounts);
    }, 0);
});



btnPayment.addEventListener('click', payment.show.bind(payment));

btnTransfer.addEventListener('click', transfer.show.bind(transfer));

btnHistory.addEventListener('click', history.show.bind(history));

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