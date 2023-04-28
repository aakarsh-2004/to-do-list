const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// const date = require(__dirname + "/date.js");

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/worklistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const workSchema = new mongoose.Schema({
    task: {
        type: String,
        required: [true, "Task must be added"]
    }
})
const Task = mongoose.model('myTask', workSchema);
const task1 = new Task({task: 'Workout'});
const task2 = new Task({task: 'Meditate'});
const task3 = new Task({task: 'Read'});

var databaseList = [task1, task2, task3];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get('/', (req, res) => {
    // const day = date.getDate();
    Task.find().exec().then( (tasks) => {
        if (tasks.length === 0) {
            Task.insertMany(databaseList)
            res.redirect("/");
        } else {
            res.render('index', { listTitle : "Today", newListItem: databaseList});
        }
    })
})

app.post('/', (req, res) => {
    const item = req.body.task;
    if (req.body.list === 'Work List') {
        workItems.push(item);
        res.redirect("/work");
    } else {
        const newItem = new Task({task: item});
        newItem.save()
        databaseList.push(newItem);
    }
    res.redirect("/");
})


app.get('/work', (req, res) => {
    res.render("index", {listTitle : "Work List", newListItem: workItems});
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

