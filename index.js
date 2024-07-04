const fs = require('fs');
const category = require('./category');
const categoryAndPlace = require('./config/categoryAndPlace.json');
const CreateTransactionFromLine = require('./entities/transaction');
const postedTransactionsFilename = './feed/pcbanking.txt';

//TODO: Convert pdf into txt and rename to pcbanking.txt

//Read an e-Statement file from ScotiaBank
fs.readFile(postedTransactionsFilename, (err, data) => {
    if (!data) {
        console.log(`Check ${postedTransactionsFilename}.`)
        return
    }
    const statementText = data.toString();
    const lines = statementText.split('\n');
    const transactionArr = [];
    lines.forEach(line => {
        const obj = CreateTransactionFromLine(line, categoryAndPlace);
        obj.parse();
        const trans = obj.getCurrentLine();
        if (trans) {
            if (!trans.category && line && line.indexOf("00-") == -1) {
                //Need to configure in categoryAndPlace.json
                console.log('!!! No categorized: ', `[${line}]`);
            } else {
                transactionArr.push(trans)
            }
        }
    })

    const totals = category.getValuesByCategory(transactionArr);
    console.log('totals', totals);

    const transactions = transactionArr.filter(t => ['other', 'commute', 'delivery', "immigration"].includes(t.category));
    console.log(Array.from(new Set(transactions.map(t => t.category + ' ' + (t.aka || t.name)))));
})




