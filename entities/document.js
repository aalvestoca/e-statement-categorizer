const fs = require('fs');
const pdf = require('pdf-parse');

async function getLines(path) {
    try {
        let dataBuffer = fs.readFileSync(path);
        const t = await pdf(dataBuffer)
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
        return lines
    } catch {
        return []
    }

}

module.exports = getLines;