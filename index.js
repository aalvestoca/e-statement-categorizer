const fs = require('fs');
const category = require('./category');
const categoryAndPlace = require('./categoryAndPlace.json');
const transaction = require('./entities/transaction');

const postedTransactionsFilename = './pcbanking.txt';//'./pcbanking.ascii';

//Read an e-Statement file from ScotiaBank
fs.readFile(postedTransactionsFilename, (err, data) => {
    const statementText = data.toString();
    const lines = statementText.split('\n');
    const transactionArr = [];
    lines.forEach(line => {
        const obj = transaction(line,categoryAndPlace);
        obj.parse();
        const trans = obj.get();
        if (trans) {
            if (!trans.category) {
                //Need to configure in categoryAndPlace.json
                console.log('!!! No categorized: ', `[${line}]`);
            } else {
                transactionArr.push(trans)
            }
        }
    })

    const totals = category.getValuesByCategory(transactionArr);
    console.log('totals',totals);

    const transactions = transactionArr.filter(t=>['other','commute','delivery',"immigration"].includes(t.category));
    console.log(Array.from(new Set(transactions.map(t=>t.category + ' ' + (t.aka || t.name)))));
})




