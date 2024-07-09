const category = require('./category');
const categoryAndPlace = require('./config/categoryAndPlace.json');
const CreateTransactionFromLine = require('./entities/transaction');
const getLines = require("./entities/document")

getLines('./feed/statement.pdf').then(lines => {
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