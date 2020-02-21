let accounts = [];

$(function () {
    let bankDataInput = $('#bankDataInput');

    let detailsJuqery = $('#details');
    let detailsJS = document.querySelector('#details');

    detailsJuqery.click(e => {

    });

    detailsJS.addEventListener('click', e => {

    })
    bankDataInput.change(() => {
        let input = bankDataInput[0];
        let file = input.files[0]

        accounts = readData(file);

        setTimeout(() => {
            $('#action').slideDown();
            $('#details').slideDown();
            generateAccountList(accounts);
        }, 0);
    });

    $('#btnPayment').click(paymentAction);
});

function generateAccountList(accounts) {
    let container = $('#accountList')
    let accountItems = '';

    accounts.forEach(item => {
        let accountTransactions = '';

        item.transactions.forEach(item => {

            let transaction = {
                date: item.date,
                amount: item.amount
            }

            accountTransactions += singleTransactionItem(transaction);
        });


        accountTransactions = `<ol class="account__transactions">${accountTransactions}</ol>`;
        accountItems += `<li id="${item.accountNumber}" class="account__item">
        <div class="account__header">
        <span>${item.accountNumber}</span> 
        <span><i class="fas fa-user"></i>  ${item.name} ${item.surname}</span> 
        <span class="${item.balance < 0 ? 'warning' : 'account__balance'}">
        ${item.balance}
        ${item.balance < 0 ? '<i class="fas fa-exclamation"></i>' : ''}
        </span> 
        <span>${item.debit}</span> 
        </div>
         
        ${accountTransactions}
        </li>`;
    });

    container.append(accountItems);

    let item = $('.account__item');
    item.click((evt) => {

        $(evt.currentTarget).find('ol').slideToggle();

    });

}

function readData(file) {
    let accounts = [];
    let reader = new FileReader();
    let container = $('#accountList')

    reader.onload = function () {
        let text = reader.result;
        let tmp = text.split('########################################')

        for (let i = 0; i < tmp.length - 1; i++) {
            const item = tmp[i];
            let lines = item.split('\n')

            lines = lines.filter(item => item !== "" && item.charCodeAt(0) !== 13);

            let userData = lines[0].split(' ');
            let transactionsTmp = [];

            for (let j = 1; j < lines.length - 1; j++) {
                const transactionData = lines[j].split(' ');

                let transaction = {
                    date: new Date(transactionData[0]),
                    amount: +transactionData[1]
                }

                transactionsTmp.push(transaction);
            }

            let account = {
                accountNumber: +userData[0],
                name: userData[1],
                surname: userData[2],
                balance: +userData[3],
                debit: +userData[4],
                transactions: transactionsTmp
            }

            accounts.push(account);
        }
    };
    reader.readAsText(file);
    return accounts;
}



function paymentAction() {
    $('#paymentSection').slideToggle();

    let select = $('#accountNumberSelect');
    let amount = $('#paymentAmount');
    let submitBtn = $('#paymentSubmit');
    let isSelected = false;
    let isAmount = false;

    select[0].selectedIndex = 0;
    amount[0].value = '';
    toggleDisableBtn(submitBtn, false, false);
    amount.removeClass('is-invalid');

    select.empty();
    select.append(`<option selected>Select Account Number...</option>`);


    accounts.forEach(item => {
        let option = `<option value="${item.accountNumber}">${item.accountNumber}</option>`;
        select.append(option);
    });


    select.change(() => {
        isSelected = select[0].selectedOptions[0].value !== 'Select Account Number...'
        toggleDisableBtn(submitBtn, isSelected, isAmount);
    });

    amount.keyup(() => {
        isAmount = (amount[0].value !== '' && amount[0].value > 0)
        toggleDisableBtn(submitBtn, isSelected, isAmount);
        amount.removeClass('is-invalid');
    });

}



$('#paymentSubmit').click(() => {
    const inputSelect = $('#accountNumberSelect');
    const inputAmount = $('#paymentAmount');

    const accountNumber = inputSelect[0].selectedOptions[0].value;
    const amountValue = roundNumber(inputAmount[0].value);
    const account = accounts.find(item => item.accountNumber == accountNumber)

    if (amountValue > account.balance + account.debit) {
        inputAmount.addClass('is-invalid');
        $('#paymentSubmit').attr('disabled', true);
        return;
    }


    const transaction = {
        date: new Date(),
        amount: -amountValue
    }

    account.transactions.push(transaction);

    let transactionList = $('#' + accountNumber + ' .account__transactions');

    transactionList.append(singleTransactionItem(transaction))

    account.balance -= amountValue;

    let htmlAmount = $('#' + accountNumber + ' .account__balance')
    htmlAmount.text(formatAmount(account.balance));

    inputSelect[0].selectedIndex = 0;
    inputAmount[0].value = '';
    toggleDisableBtn($(this), false, false);

});



function roundNumber(amount) {
    return Math.floor(amount * 100) / 100;
}

function formatAmount(amount) {
    let number = +amount; 
    return number.toFixed(2); 
}

function singleTransactionItem(transaction) {
    const shortDate = shortFormatDate(transaction.date);
    const amount = formatAmount(transaction.amount);
    return `<li>
            <i class="far fa-calendar"></i>
            ${shortDate}
             <span class="u-ml--sm">
             <i class="fas fa-money-bill-wave "></i>
             ${amount}</span>
             </li>`
}

function toggleDisableBtn(btn, condition1, condition2) {
    if (condition1 && condition2) {
        btn.removeAttr('disabled');
    }
    else {
        btn.attr('disabled', true);
    }
}

function shortFormatDate(date) {
    return `${date.getFullYear()}-${this.addZero(date.getMonth() + 1)}-${this.addZero(date.getDate())}
    ${this.addZero(date.getHours())}:${this.addZero(date.getMinutes())}`
}

function addZero(txt) {

    txt = String(txt).length === 1 ? `0${txt}` : txt;

    return txt;
}