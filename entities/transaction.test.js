const category = require('../category');
const categoryAndPlace = require('../config/categoryAndPlace.json');
const CreateTransactionFromLine = require('./transaction');

test('No line, empty transaction', () => {
    const obj = CreateTransactionFromLine();
    expect(obj.toString()).toBe('name: [], aka: [], value: [], category: []');
});

test('Line with valid place', () => {
    const obj = CreateTransactionFromLine('008 Oct 15 Oct 17 PRESTO EGLINTON STN TORONTO ON 20.00', categoryAndPlace);
    obj.parse();
    expect(obj.toString()).toBe('name: [PRESTO], aka: [PRESTO], value: [20], category: [commute]');
});

test('Validation line with place, category, and ammount', () => {
    const obj = CreateTransactionFromLine('021 Aug 30 Aug 31 BECK TAXI TORONTO ON 765.50\r', categoryAndPlace);
    obj.parse();
    const t = obj.getCurrentLine();
    expect(t.name).toBe('BECK TAXI');
    expect(t.aka).toBe('BECK TAXI');
    expect(t.value).toBe(765.5);
    expect(t.category).toBe('commute');
});

test('Line with unknown place, empty transaction', () => {
    const obj = CreateTransactionFromLine('errRI AND CHOCRON DENTIS TORONTO ON 765.50\r', categoryAndPlace);
    obj.parse();
    expect(obj.toString()).toBe('name: [], aka: [], value: [], category: []');
});

function getTotal(txt, arr) {
    const lines = arr ? arr.map(t => t.trim()) : txt ? txt.split('\n').map(t => t.trim()) : []
    const transactionArr = [];
    lines.forEach(line => {
        const obj = CreateTransactionFromLine(line, categoryAndPlace);
        obj.parse();
        const trans = obj.getCurrentLine();
        if (trans) {
            if (!trans.category && line && line.indexOf("00-") == -1) {
                //Need to configure in categoryAndPlace.json
                //console.log('!!! No categorized: ', `[${line}]`);
            } else {
                transactionArr.push(trans)
            }
        }
    })

    return category.getValuesByCategory(transactionArr);
}

test('Checking total ammount', () => {
    const txt = `046 May 31 Jun 3 MASTERMIND - BARRHAVEN NEPEAN ON 4.47
047 May 31 Jun 3 PRESTO MOBL TORONTO ON 10.00
050 May 31 Jun 3 LOBLAWS 1035 NEPEAN ON 35.65
051 May 31 Jun 3 WINNERS 342 NEPEAN ON 45.19
055 Jun 3 Jun 4 SHOPPERS DRUG MART #06 OTTAWA ON 2.24
057 Jun 3 Jun 5 FARM BOY #75 OTTAWA ON 6.22
058 Jun 3 Jun 5 MCDONALD'S #5409 OTTAWA ON 8.79
059 Jun 3 Jun 5 MCDONALD'S #5409 OTTAWA ON 15.12`

    expect(getTotal(txt).total).toBe(127.68);
});

test('Checking total ammount from a PDF file', async () => {
    const fs = require('fs');
    try {
        const stats = fs.statSync("./feed/statement.pdf")
        if (stats) {
            let dataBuffer = fs.readFileSync('./feed/statement.pdf');
            const pdf = require('pdf-parse');
            const t = await pdf(dataBuffer)
            const arr = t.text.split("\n")
            const regex = /^[0-9]{3}/
            const a = arr.filter(r => {
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
            //console.log(a.length, a)
            expect(getTotal(null, a).total).toBe(1775.65);
        }
    } catch {

    }


});
