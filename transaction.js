const category = require('./category');

function getTransaction(data) {
    const d = data.split(',');
    if (d[1]) {
        const origin = d[1].split('  ');
        const value = parseFloat(parseFloat(d[2]).toFixed(2));
        const name = origin[0].replace('"', '');
        const place = category.getPlace(name);

        return {
            date: new Date(d[0]),
            name: place.name,
            aka: place.aka || place.name,
            value,
            category: category.getCategory(origin[0]),
        }
    }
    return null;
}

module.exports = { getTransaction }