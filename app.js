const express = require('express');
const app = express();
const bodyParser = require('body-parser');

var items = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    var today = new Date();
    var options = {
        weekday: 'long',
        day: 'numeric',
        month: 'long'
    };
    var day = today.toLocaleDateString("en-US", options);
    res.render('index', { kindOfDay : day, newListItem: items});
});

app.post('/', (req, res) => {
    var item = req.body.task;
    items.push(item);
    res.redirect("/");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});