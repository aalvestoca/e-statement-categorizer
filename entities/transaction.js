const category = require('../category');

const CreateTransactionFromLine = (billLine, categories, isLog) => {
    let _trans = {
        name: '',
        aka: '',
        value: '',
        category: '',
    }

    function parse() {
        const arr = billLine.trim().split(' ')
        if (arr[1]) {
            const value = arr[arr.length-1] ? parseFloat(arr[arr.length-1].replace(',', '')) : 0;
            const place = category.getPlace(categories, billLine);
            const name = place.name ? place.name.trim() : null;
            if(!name){
                _trans = null;
                return
            }
            _trans = { 
                name: name,
                aka: place.aka || name,
                value,
                category: category.getCategory(categories, billLine),
            }
        }
    }
    function toString() {
        return `name: [${_trans.name}], aka: [${_trans.aka}], value: [${_trans.value}], category: [${_trans.category}]`
    }
    function getCurrentLine() {
        return _trans
    }
    return {
        parse,
        toString,
        getCurrentLine
    }
}

module.exports = CreateTransactionFromLine