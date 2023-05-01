const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const date = require("./views/date.js");

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/worklistDB', {useNewUrlParser: true, useUnifiedTopology: true});
const workSchema = new mongoose.Schema({
    task: String
})

// const topicSchema = {
//     name: String,
//     items: [workSchema]
// };

// const Topic = mongoose.model("Topic", topicSchema);


const Task = mongoose.model('myTask', workSchema);
const task1 = new Task({task: 'Workout'});
const task2 = new Task({task: 'Meditate'});
const task3 = new Task({task: 'Read'});

var databaseList = [task1, task2, task3];

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.get('/', (req, res) => {
    const day = date.getDate();
    Task.find().exec().then( (tasks) => {
        if (tasks.length === 0) {
            Task.insertMany(databaseList)
            res.redirect("/");
        } else {
            res.render('index', { listTitle : day, newListItem:
            databaseList});
        }
    })
});

// app.get("/my/:customListName", (req, res) => {
//     const topic = req.params.customListName;
//     const newTopic = new Topic({name: topic, items: databaseList});
//     newTopic.save();
//     Topic.find({name: topic}).exec().then( (ele) => {
//         if (topic === ele.name) {
//             res.render("index", {listTitle : topic, newListItem:
//             databaseList})
//         } else {
//             const newTopic = new Topic({name: topic, items: databaseList});
//             newTopic.save();
//             res.redirect("/my/" + topic);
//         }
//     });
// });

app.post('/delete', (req, res) => {
    var checkedItemId = req.body.checkbox;
    Task.deleteOne({task: checkedItemId}).then((e) => {
        console.log(e);
    });
    for(let i = 0; i < databaseList.length; i++) {
        if(databaseList[i].task === checkedItemId) {
            databaseList.splice(i, 1);
        } else {
            console.log("Not found!");
        }
    }
    res.redirect("/");
});

app.post('/', (req, res) => {
    const item = req.body.task;
    const newItem = new Task({task: item});
    newItem.save()
    databaseList.push(newItem);
    res.redirect("/");
    }
)

app.listen(3000, () => {
    console.log("Server started on port 3000");
});

