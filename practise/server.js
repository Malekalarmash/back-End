const express = require('express')
const bodyParser = require('body-parser')
const app = express()
// Allows us to read the body of a request 
app.use(bodyParser.json())
let todoList = []
let id = 1;
let completed = false; 
// Create Todo App 
// NOTE: endpoints should always be the resource being retrieved or modified
app.get('/todos', (req, res)=>{
    res.send(todoList)
})

app.post('/todos', (req, res)=>{
    // Add todo to the array 

    // Gets the type of whatever argument is passed in
    if(typeof(req.body.todo) != 'string'){
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
        res.send(todoList)
    }
    
})
//NOTE: Path parameters are donated by a /: in front. You dont actuall type
// "id", you simply type in the appropriate id number
app.delete('/todos/:id', (req, res)=>{
     // Failure Case: Client dosent provide an ID 
    if(req.params.id == ""){
        res.status(400).send('Must provide an ID')
        // Failure Case: Client provides a negative ID 
    }else if(Number(req.params.id) < 1 ){   
        res.status(400).send('The ID Must be postivie number') 
    }
    // Check if the id provided is in the TodoList
    for(let i = 0; i < todoList.length; i++){
        if (req.params.id == todoList[i].id){
        //    Success Case: Loop through array, once we find the id, delete the todo 
            res.send(todoList.splice(i, 1))  
        }  
    }
    // Error: Could not find an ID that matches the id provided
    res.status(500).send('Server Error')
    }
)

app.put('/todos/:id',(req, res)=>{
    // Failure Case: Client dosent provide an ID 
    if(req.params.id == ""){
        res.status(400).send('Must provide an ID')
        // Failure Case: Client provides a negative ID 
    }else if(Number(req.params.id) < 1 ){   
        res.status(400).send('The ID Must be postivie number') 
    }
    for(let i = 0; i < todoList.length; i++){
        // Change completed to true when completed
        if (req.params.id == todoList[i].id && req.body.completed == true){
            todoList[i].completed = true; 
            // todoList.push(completed)
            res.send(todoList)
        }
        // Update the todo list 
        else if(req.params.id == todoList[i].id) {
        todoList[i].todo = req.body.todo
        res.send(todoList)
        }
        }
        res.send(todoList)  
    }
)

app.listen(5500, () => {
    console.log('Server is Running on Port 5500')
})