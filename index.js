const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

// --------------------------- Mongoose Configuration --------------------------- //

const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { response } = require('express');

mongoose.connect(process.env.URI);


const model = mongoose.model;
const Schema = mongoose.Schema;


const userSchema = new Schema({
  username: String
});

const exerciseSchema = new Schema({
  description: String,
  duration: Number,
  date: Date,
  userId: String
})


const User = new model('User', userSchema);

const Exercise = new model('Exercise', exerciseSchema);

// --------------------------- APIs Calls--------------------------- //

app.use(cors())

app.use(express.static('public'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.use(bodyParser.urlencoded({ extended: false }));

app.post('/api/users', newUser);

app.get('/api/users', getUsers);

app.post('/api/users/:id?/exercises', addExercise);

app.get('/api/users/:id?/logs', getLogs)


// --------------------------- Main ---------------------------//


function newUser(req, res){
  User.findOne({username: req.body.username}, {_id: 1, username: 1} , (err, userData)=>{
    if(err) console.log(err);

    if(userData){
      res.json(userData);

    }else{

      new User({
        username: req.body.username
      })

      .save()

      .then(savedUser =>{
        res.json({
          _id: savedUser._id,
          username: savedUser.username
        });
      })

    }

  })
}


function getUsers(req, res){
  User.find({}, {_id: 1, username: 1}, (err, users)=>{
    if(err) console.log(err);
    res.json(users);
  })
}


function addExercise(req, res){
  const userId = req.params.id;

  let date;
  if(req.body.date){
    date = new Date(req.body.date)
  } else {
    date = new Date()
  }
  const description = (req.body.description).toString();
  const duration = (req.body.duration) * 1;

  User.findById(userId, (err, userObj)=>{
    if(!userObj) return res.json({error: "User not found"});
    new Exercise({
      description: description,
      duration: duration,
      date: date,
      userId: userId
    }).save((err, data)=>{
      res.json({
        _id: userObj._id,
        username: userObj.username,
        date: data.date.toDateString(),
        duration: data.duration,
        description: data.description
      })
    })
  })
}


function getLogs(req, res){
  const userId = req.params.id;
  const {from, to, limit} = req.query;
  let responseObj = {
    _id: userId
  }

  User.findById(userId)

    .then(function(userObj){
      if(!userObj) return res.json({error: "User not found"});
      let query = {
        userId: userId
      }

      if(from){
        if(to){
          query.date = {$gte: from, $lte: to};
        } else{
          query.date = {$gte: from};
        }
      }




      responseObj.username = userObj.username;
      if(limit){
        return Exercise.find(query, {description: 1, duration: 1, date: 1, _id: 0}).limit(limit);
      } else{
        return Exercise.find(query, {description: 1, duration: 1, date: 1, _id: 0});
      }


    })





    .then(function(excLogs){

      responseObj.log = excLogs.map(doc =>{
        return {
          description: doc.description,
          duration: doc.duration,
          date: doc.date.toDateString()
        }
      });

      responseObj.count = excLogs.length;
      res.json(responseObj);
    })
  


    .catch(function(error){
      console.log(error);
    })

}





// --------------------------- Listener ---------------------------//

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
