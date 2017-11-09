const express = require('express');


const app = express();

app.get('/', (req, res) => {
    res.status(404).send({
        error: "Error!",
        name: "Todo App v1.0"
    })
});


app.get('/users', (req, res) => {
    res.status(200).send([
        { name: "Ryan" , age: 29 },
        { name: "Jim", age: 34 },
        { name: "Andrew", age: 25 }
    ])
})


app.listen(3000, () => {
    console.log("Server running on localhost:3000")
});

module.exports = {
    app
}
