
const fs = require('fs');
const category = require('./category');
const transaction = require('./transaction');

const date1 = ''//'12/07/2021';
const date2 = ''//'01/10/2022';
const postedTransactionsFilename = './pcbanking.ascii';

//Read an e-Statement file from ScotiaBank
fs.readFile(postedTransactionsFilename, (err, data) => {
    const statementText = data.toString();
    const lines = statementText.split('\n');

    const transactionArr = [];
    lines.forEach(line => {
        const trans = transaction.getTransaction(line);
        console.log(trans);
        if (trans && (!date1 || trans.date >= new Date(date1.concat(' 00:00:00')) && trans.date <= new Date(date2.concat(' 23:59:59')))) {
            if (!trans.category) {
                //Need to configure in categories.json
                console.log('!!! No category: ', line);
            } else {
                transactionArr.push(trans)
            }
        }
    })

    const totals = category.getValuesByCategory(transactionArr);
    console.log('totals',totals);

    const transactions = transactionArr.filter(t=>t.category === 'pharmacy');
    console.log(transactions);
})




