const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/worklistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const workSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, "Task must be added"]
    }
})
const myTask = mongoose.model('myTask', workSchema);
var items = [];
var workItems = [];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    const day = date.getDate();
    res.render('index', { listTitle : day, newListItem: items});
});


app.post('/', (req, res) => {
    const item = req.body.task;
    if (req.body.list === 'Work List') {
        workItems.push(item);
        res.redirect("/work");
    } else {
        items.push(item);
        const work = new myTask({task: item});
        work.save();
        res.redirect("/");
    }
    
});

app.get('/work', (req, res) => {
    res.render("index", {listTitle : "Work List", newListItem: workItems});
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});