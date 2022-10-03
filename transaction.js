const category = require('./category');

function getTransaction(data, format) {
    if(format === 'txt'){
        const d = data.split(' ');
        if (d[1]) {
            const nameValueArr = d.splice(5).join(' ').split(' ON ')
            //'021 Aug 30 Aug 31 HARARI AND CHOCRON DENTIS TORONTO ON 765.50\r',
            const value = parseFloat(parseFloat(nameValueArr[1]).toFixed(2));
            const name = nameValueArr[0];
            const place = category.getPlace(name);
            if(!place.name){
                console.log(name)
            }
    
            return {
                //date: new Date(d[0]),
                name: place.name,
                aka: place.aka || place.name,
                value,
                category: category.getCategory(name),
            }
        }
    } else {
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
    }
    return null;
}

module.exports = { getTransaction }