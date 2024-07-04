
function getCategory(categoryAndPlace, origin) {
    const keys = Object.keys(categoryAndPlace);
    for (let i = 0; i < keys.length; ++i) {
        if (categoryAndPlace[keys[i]].some(o => origin.indexOf(o.name) >= 0)) {
            return keys[i];
            break;
        }
    }
    return null;
}

function getPlace(categoryAndPlace, origin) {
    const keys = Object.keys(categoryAndPlace);
    for (let i = 0; i < keys.length; ++i) {
        const g = categoryAndPlace[keys[i]].find(o => origin.indexOf(o.name) >= 0);
        if (g) {
            return {...g, category: keys[i]};
            break;
        }
    }
    return {};
}

function getValuesByCategory(arr) {
    const r = arr.reduce((acc, curr) => {
        if(curr.category){
            if (acc[curr.category]) {
                acc[curr.category] = parseFloat(parseFloat(acc[curr.category] + curr.value).toFixed(2));
            }
            else
                acc[curr.category] = curr.value;
    
            acc.total = parseFloat(parseFloat((acc.total || 0) + curr.value).toFixed(2));
        }

        return acc
    }, {})

    return r;
}

module.exports = { getCategory, getValuesByCategory, getPlace };