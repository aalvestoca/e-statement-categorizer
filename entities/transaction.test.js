const Transaction = require('./transaction');
const categoryAndPlace = {
    "commute": [
        {
            "name": "PRESTO"
        },
        {
            "name": "BECK TAXI"
        },
        {
            "name": "CANADA AUTO PARKS"
        }
    ],
}

test('toString', () => {
    const obj = Transaction();
    expect(obj.toString()).toBe('name: [], aka: [], value: [], category: []');
});

test('parse', () => {
    const obj = Transaction('008 Oct 15 Oct 17 PRESTO EGLINTON STN TORONTO ON 20.00', categoryAndPlace);
    obj.parse();
    expect(obj.toString()).toBe('name: [PRESTO], aka: [PRESTO], value: [20], category: [commute]');
});

test('get', () => {
    const obj = Transaction('021 Aug 30 Aug 31 BECK TAXI TORONTO ON 765.50\r', categoryAndPlace);
    obj.parse();
    const t = obj.get();
    expect(t.name).toBe('BECK TAXI');
    expect(t.aka).toBe('BECK TAXI');
    expect(t.value).toBe(765.5);
    expect(t.category).toBe('commute');
});

test('parse with unknown place', () => {
    const obj = Transaction('errRI AND CHOCRON DENTIS TORONTO ON 765.50\r', categoryAndPlace);
    obj.parse();
    expect(obj.toString()).toBe('name: [], aka: [], value: [], category: []');
});
