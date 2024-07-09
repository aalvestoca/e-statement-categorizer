

test("Get lines of a PDF file", async () => {
    const getLines = require("./document")
    expect((await getLines('./feed/statement.pdf')).length).toBe(59)
})