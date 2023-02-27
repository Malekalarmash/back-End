const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const moment = require ('moment');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const todoList = require('./database')
const ejs = require ('ejs')
const logger = require('./logger');
const { level } = require('winston');


// Adds our templating engine
app.set('view engine', 'ejs'); 
// Allows us to read the body of a request 
app.use(bodyParser.json())


let id = 1;
let completed = false; 
let time = new Date()


function output(req, level, message){
    logger.log({
        method:req.method,
        level: level, 
        path: req.path,
        paramaters: req.params, 
        message: message, 
        timestamp: time.toLocaleString()
    })
  
    
}
// This endpoint will run everytime
app.all('*', (req, res, next)=>{
    logger.info({
        method:req.method,
        level: level, 
        path: req.path,
        paramaters: req.params, 
        timestamp: time.toLocaleString()
    })
    next()

})

// GoogleStrategy.use(new GoogleStrategy({
//     clientID: '605786637141-vu05kaemm4nouiip1mgas63r0ofgn3ii.apps.googleusercontent.com',
//     clientSecret: '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',
//     callbackURL: "http://localhost:5500/auth/google/callback"
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     User.findOrCreate({ googleId: profile.id }, function (err, user) {
//       return cb(err, user);
//     });
//   }
// ));
// Create Todo App 
// NOTE: endpoints should always be the resource being retrieved or modified
app.get('/todos', (req, res)=>{
    output(req, 'info', 'Get End Point was called')
    console.log(todoList)
    //  Index is the name of the file in the views folder
    res.render('index', {list: todoList})
})



app.post('/todos', (req, res)=>{
    // Add todo to the array 
    // Gets the type of whatever argument is passed in
    if(typeof(req.body.todo) != 'string'){
        output(req, 'error', 'Todo must be a string')    
        res.status(400).send('Todo must be a string value')
    }else if (Object.keys(req.body).length > 1){
        res.status(400).send('Malformed request sent')        
    }
    else{
        todoList.push({
            id: id++,
            todo: req.body.todo,
            completed: false
        })
        output(req, 'info','Todo item was added')
        res.send(todoList)
    }  
})
//NOTE: Path parameters are donated by a /: in front. You dont actuall type
// "id", you simply type in the appropriate id number
app.delete('/todos/:id', (req, res)=>{
     // Failure Case: Client dosent provide an ID 
    if(req.params.id == ""){
        logger.log({
            endpoint:'Delete', 
            path:'/todos', 
            level:'error', 
            paramaters: req.body.todo, 
            message:'Must provide an ID', 
            timestamp: time.toLocaleString()
        })
        res.status(400).send('Must provide an ID')
        // Failure Case: Client provides a negative ID 
    }else if(Number(req.params.id) < 1 ){   
        res.status(400).send('The ID Must be postivie number') 
    }
    // Check if the id provided is in the TodoList
    else{
        for(let i = 0; i < todoList.length; i++){
            if (req.params.id == todoList[i].id){
            //    Success Case: Loop through array, once we find the id, delete the todo 
                res.send(todoList.splice(i, 1))  
            }  
        }
        }
    }
)

app.put('/todos/:id',(req, res)=>{
    const info = req.body 
    const todoId = req.params.id
   // Failure Case: Client dosent provide an ID 
   if(todoId < 1){
    res.send("Must provide a positive ID")
   }else if (!todoId){
    res.send("Must provide an ID")
   }else{
    // .map just update an array, creates a new array 
        const todoUpdate = todoList.map(todo=>
            // it 
            // ? Ternary operator, it has 3 componenets, the 1st is a condition, 2nd what needs to be done if the condition is true, 3rd what to do if the condition is false
            todo.id == todoId?{...todo, todo: info.todo ? info.todo: todo.todo, completed: info.completed ? info.completed: todo.completed}: todo)
        todoList = todoUpdate
        res.send(todoList)
   }

   
})
app.get('/login', (req, res)=>{
    res.send('error: Failed to login to Google')
})
// app.get('/auth/google',
//   passport.authenticate('google', { scope: ['profile'] }));

// app.get('/auth/google/callback', 
//   passport.authenticate('google', { failureRedirect: '/login' }),
//   function(req, res) {
//     // Successful authentication, redirect home.
//     res.redirect('/');
//   });

app.listen(5500, () => {
    console.log('Server is Running on Port 5500')
})