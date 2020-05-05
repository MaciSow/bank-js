import { toggleDisableBtn, roundNumber, slideUp, slideDown, slideToggle, collapseWithoutCurrent } from "./utilities.js";
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

btnTransfer.addEventListener('click', transferAction);


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
    const inputSelect = paymentSection.querySelector('#accountNumberSelect');
    const inputAmount = paymentSection.querySelector('#paymentAmount');
    const submitBtn = paymentSection.querySelector('#paymentSubmit');
    let isSelected = false;
    let isAmount = false;

    const wait = collapseWithoutCurrent('actionContainer', paymentSection);

    setTimeout(() => {
        slideToggle(paymentSection);
    }, wait ? 250 : 0)

    inputSelect.selectedIndex = 0;
    inputAmount.value = '';
    submitBtn.setAttribute('disabled', true);
    inputAmount.classList.remove('is-invalid');
    inputSelect.innerHTML = null;
    inputSelect.innerHTML = `<option value="0" selected>Select Account Number...</option>`;

    accounts.forEach(item => {
        let option = `<option value="${item.accountNumber}">${item.accountNumber}</option>`;
        inputSelect.innerHTML += option;
    });

    inputSelect.addEventListener('change', () => {
        isSelected = +inputSelect.selectedOptions[0].value !== 0;
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
        const account = accounts.find(item => String(item.accountNumber) == accountNumber); 

        if (amountValue > account.balance + account.debit) {
            inputAmount.classList.add('is-invalid');
            submitBtn.setAttribute('disabled', true);
            isSelected = true;
            return;
        }

        account.balance -= amountValue;
        const transaction = new Transaction(null, -amountValue);
        account.addTransaction(transaction);
        account.rebuildTransactions();

        inputSelect.selectedIndex = 0;
        inputAmount.value = '';
        submitBtn.setAttribute('disabled', true);
        isSelected = false;
        isAmount = false;
    });

}

function transferAction() {
    const transferContainer = document.querySelector('#transferContainer');
    const senderAccNumSelect = transferContainer.querySelector('#senderAccNumSelect');
    const receiverAccNumSelect = transferContainer.querySelector('#receiverAccNumSelect');
    const transferAmount = transferContainer.querySelector('#transferAmount');
    const transferSubmit = transferContainer.querySelector('#transferSubmit');
    const inputTransferGroup = transferContainer.querySelector('.input-group');
    let wait = collapseWithoutCurrent('actionContainer', transferContainer);
    let senderSelectedAccount;

    setTimeout(() => {
        slideToggle(transferContainer);
    }, wait ? 250 : 0)

    senderAccNumSelect.selectedIndex = 0;
    senderAccNumSelect.innerHTML = null;
    senderAccNumSelect.innerHTML = `<option value="0" selected>Select Sender Account Number...</option>`;
    transferAmount.value= null;
    receiverAccNumSelect.classList.add('u-hide');
    transferSubmit.classList.add('u-hide');
    inputTransferGroup.classList.add('u-hide');

    accounts.forEach(item => {
        let option = `<option value="${item.accountNumber}">${item.accountNumber}</option>`;
        senderAccNumSelect.innerHTML += option;
    });

    senderAccNumSelect.addEventListener('change', () => {
        senderSelectedAccount = +senderAccNumSelect.selectedOptions[0].value;
        inputTransferGroup.classList.add('u-hide');

        if (senderSelectedAccount === 0) {
            receiverAccNumSelect.classList.add('u-hide');
            return;
        }

        receiverAccNumSelect.classList.remove('u-hide');
        receiverAccNumSelect.selectedIndex = 0;
        receiverAccNumSelect.innerHTML = null;
        receiverAccNumSelect.innerHTML = `<option value="0" selected>Select Receiver Account Number...</option>`;

        accounts.forEach(item => {
            if (item.accountNumber !== senderSelectedAccount) {
                let option = `<option value="${item.accountNumber}">${item.accountNumber}</option>`;
                receiverAccNumSelect.innerHTML += option;
            }
        });
    });

    receiverAccNumSelect.addEventListener('change', () => {
        const receiverSelectedAccount = +receiverAccNumSelect.selectedOptions[0].value;

        if (receiverSelectedAccount === 0) {
            inputTransferGroup.classList.add('u-hide');
            return;
        }
        inputTransferGroup.classList.remove('u-hide');
        transferAmount.value = '';
    });
    
    transferAmount.addEventListener('input', () => {
        transferAmount.classList.remove('is-invalid');
        
        if(transferAmount.value !== '' && transferAmount.value > 0){;
        transferSubmit.classList.remove('u-hide');
        }
        else{
            transferSubmit.classList.add('u-hide');
        }

        const account = accounts.find(item => item.accountNumber == senderSelectedAccount);
        
        if (account.balance + account.debit < transferAmount.value) {
            transferAmount.classList.add('is-invalid');
            transferSubmit.classList.add('u-hide');
        }
    });
    
    transferSubmit.addEventListener('click', () => {
        const senderAccountNumber = senderAccNumSelect.selectedOptions[0].value;
        const receiverAccountNumber = receiverAccNumSelect.selectedOptions[0].value; 
        
        const senderAccount = accounts.find(item => String(item.accountNumber) == senderAccountNumber); 
        const receiverAccount = accounts.find(item => String(item.accountNumber) == receiverAccountNumber); 

        const amountValue = roundNumber(transferAmount.value);

        senderAccount.balance -= amountValue;
        const senderTransaction = new Transaction(null, -amountValue);
        senderAccount.addTransaction(senderTransaction);
        senderAccount.rebuildTransactions();

        receiverAccount.balance += amountValue;
        const receiverTransaction = new Transaction(null, amountValue);
        receiverAccount.addTransaction(receiverTransaction);
        receiverAccount.rebuildTransactions();

        slideUp(transferContainer);
    });

}
