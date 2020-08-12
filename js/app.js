import { slideDown, slideToggle, generateFile, slideReset, slideUp } from "./utilities.js";
import { Transaction } from "./Transaction.js";
import { Account } from "./Account.js";
import { Payment } from "./Payment.js";
import { Transfer } from "./Transfer.js";
import { History } from "./History.js";
import { Notification } from "./Notification.js";
import { Contest } from "./Contest.js";

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
const contest = new Contest();

const data = `
91249000054932137874721600 Stanislaw Gaska +3243.33 1000
2005-10-12T00:25 +35.35
2005-10-12T00:25 -357.35
2005-10-12T00:25 +643.35
2005-10-12T00:25 +775.35
2005-10-12T00:25 -333.05
2005-10-12T00:25 -323.36
2020-01-17T13:09 -200.00
2020-01-21T12:39 +243.33
########################################
31249000053409601064850223 Bozena Lipa +3872.77 500
2002-10-08T17:55 -443.36
2002-10-18T00:25 +315.35
2002-10-18T03:25 +315.35
2002-10-18T12:25 +315.35
2003-01-12T12:44 -357.35
2005-09-23T23:11 +343.35
2006-03-22T20:00 +75.35
2007-05-30T05:59 -123.05
2020-01-03T16:40 -124.45
2020-01-21T12:34 -30.00
2020-01-21T12:35 -30.34
2020-01-21T12:38 -23.33
########################################
22147000027657492807987470 Ala Grzyb -306.12 2000
2003-01-12T12:44 -357.35
2005-09-23T23:11 +343.35
2006-03-22T20:00 +75.35
2020-01-21T17:17 -12.00
2020-01-21T18:19 +5.45
2020-01-21T18:23 +5.45
2020-01-25T12:53 -150.34
2020-01-25T12:53 +13.00
2020-01-25T12:58 -150.34
2020-01-25T13:00 -12.34
########################################
49249000055310725129397059 Magdalena Oswiecona -987.66 2000
2003-01-12T12:44 -357.35
2005-09-23T23:11 +343.35
2006-03-22T20:00 +75.35
2020-01-17T13:09 +200.00
2020-01-25T13:00 +12.34
########################################
81240000122737423850546624 Kasia Nowak -299.31 2000
2003-01-12T12:44 -357.35
2005-09-23T23:11 +343.35
2006-03-22T20:00 +75.35
2020-01-03T13:09 +333.00
2020-01-03T13:09 +12.12
2020-01-03T13:11 +12.12
2020-01-03T13:11 +13.00
2020-01-03T13:18 +123.00
2020-01-03T16:39 +35.00
2020-01-03T16:40 +124.45
########################################
`;

accounts = readDataStatic();
loadData();
contest.show(accounts);

bankDataInput.addEventListener('change', () => {
    let input = bankDataInput;
    let file = input.files[0];

    accounts = readData(file);

    setTimeout(() => loadData());
    
});

btnPayment.addEventListener('click', () => payment.show(accounts));

btnTransfer.addEventListener('click', () => transfer.show(accounts));

btnHistory.addEventListener('click', () => history.show(accounts));

btnContest.addEventListener('click', () => contest.show(accounts));

btnSave.addEventListener('click', saveData);

function loadData() {
    const actionContainer = document.querySelector('#actionContainer');
    const detailsContainer = document.querySelector('#detailsContainer');

    if (accounts.length === 0) {
        
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
}

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

function readDataStatic() {
    let accounts = [];

    let text = data;

    

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

    return accounts;
}