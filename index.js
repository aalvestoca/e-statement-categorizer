const fs = require('fs');
const category = require('./category');
const categoryAndPlace = require('./config/categoryAndPlace.json');
const CreateTransactionFromLine = require('./entities/transaction');
const postedTransactionsFilename = './feed/pcbanking.txt';

//TODO: Convert pdf into txt and rename to pcbanking.txt
//const fs = require('fs');
const pdf = require('pdf-parse');
let dataBuffer = fs.readFileSync('./feed/statement.pdf');
pdf(dataBuffer).then(function (t) {
    const arr = t.text.split("\n")
    const regex = /^[0-9]{3}/
    const lines = arr.filter(r => {
        const x = regex.test(r)
        return x && r.length > 25
    }).map(m => {
        let i = m.lastIndexOf(".") - 1
        while (!isNaN(m[i])) {
            i--
        }
        i++
        return m.slice(0, i) + " " + m.slice(i)
    })
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
    const total = totals.total;
    delete totals.total;
    console.log("")
    console.log("--------------------")
    console.log("--- TRANSACTIONS BY CATEGORY (DETAILS BELLOW):")
    console.log(totals);
    console.log('TOTAL: ', total);
    console.log("--------------------")

    console.log("--- CATEGORY DETAILS:")
    detailCategory("other")
    detailCategory("delivery")
    detailCategory("dentist", lines)
    detailCategory("salon")
    console.log("--------------------")

    function detailCategory(categoryName, lines) {
        console.log(`@ ${categoryName}`)
        const transactions = transactionArr.filter(t => [categoryName].includes(t.category));
        console.log(Array.from(new Set(transactions.map(t => t.aka || t.name))));
        if (lines) {
            Array.from(new Set(transactions)).forEach(t => lines.filter(i => i.includes(t.name)).map(i => console.log(i)))
        }
    }
})


//Read an e-Statement file from ScotiaBank
fs.readFile(postedTransactionsFilename, (err, data) => {
    if (!data) {
        console.log(`Check ${postedTransactionsFilename}.`)
        return
    }
    const statementText = data.toString();
    const lines = statementText.split('\n');

    //TODO: here array

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
    const total = totals.total;
    delete totals.total;
    console.log("")
    console.log("--------------------")
    console.log("--- TRANSACTIONS BY CATEGORY (DETAILS BELLOW):")
    console.log(totals);
    console.log('TOTAL: ', total);
    console.log("--------------------")

    console.log("--- CATEGORY DETAILS:")
    detailCategory("other")
    detailCategory("delivery")
    detailCategory("dentist", lines)
    detailCategory("salon")
    console.log("--------------------")

    function detailCategory(categoryName, lines) {
        console.log(`@ ${categoryName}`)
        const transactions = transactionArr.filter(t => [categoryName].includes(t.category));
        console.log(Array.from(new Set(transactions.map(t => t.aka || t.name))));
        if (lines) {
            Array.from(new Set(transactions)).forEach(t => lines.filter(i => i.includes(t.name)).map(i => console.log(i)))
        }
    }
})




