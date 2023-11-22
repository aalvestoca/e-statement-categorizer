const category = require('../category');

const Transaction = (billLine, categories, isLog) => {
    const line = billLine;
    let _trans = {
        name: '',
        aka: '',
        value: '',
        category: '',
    }
    function parse() {
        const arr = line.split(' ');
        if (arr[1]) {
            const value = arr[arr.length-1] ? parseFloat(arr[arr.length-1].replace(',', '')) : 0;
            const place = category.getPlace(categories, line);
            if(!place.name) return
            _trans = { 
                name: place.name,
                aka: place.aka || place.name,
                value,
                category: category.getCategory(categories, line),
            }
        }
    }
    function toString() {
        return `name: [${_trans.name}], aka: [${_trans.aka}], value: [${_trans.value}], category: [${_trans.category}]`
    }
    function get() {
        return _trans
    }
    return {
        parse,
        toString,
        get
    }
}

module.exports = Transaction