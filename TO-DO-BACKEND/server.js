//Express
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
//instance
const app = express()
app.use(express.json())
app.use(cors())

// sample memory
//let todos = []

// connecting mongdb
mongoose.connect('mongodb://localhost:27017/mern-todo')
.then(()=>{console.log('DB connected Success!')})
.catch((err)=>{console.log(err)})

//Schema
const todoSchema = new mongoose.Schema({
    title : {require:true,
        type: String
    },
    description : String

})

//model

const todoModel = mongoose.model('Todo' , todoSchema)

//To-Do Create route
app.post('/todos',async (req,res)=>
{
  const {title, description} = req.body
//   const newTodo = {
//                 id : todos.length +1,
//                 title,
//                 description
//             }
//     todos.push(newTodo)
//     console.log(todos)
try {
    const newTodo = new todoModel({title,description})
    await newTodo.save();
    res.status(201).json(newTodo)
} catch (error) {
    console.log(error)
    res.status(500).json({message:error.message})
}

})

//Get all Items

app.get('/todos',async (req,res)=>{
try {
    const todos = await todoModel.find()
    res.json(todos)
} catch (error) {
    console.log(error)
    res.status(500).json({message:error.message})
    
}
})

//update

app.put('/todos/:id', async (req,res)=>{
    try {
        const {title, description} = req.body
    const id = req.params.id
    const updatedTodo = await todoModel.findByIdAndUpdate(
        id,
        {title,description},
        {new:true}
    )
if(!updatedTodo){
    return res.status(404).json({message:"Todo not found"})
}
res.json(updatedTodo)
    } 
catch (error) {
    console.log(error)
    res.status(500).json({message:error.message})
    }
    }

)

// delete

app.delete('/todos/:id',async (req,res)=>{
   try {
    const id = req.params.id
    await todoModel.findByIdAndDelete(id)
    res.status(204).end()
    
   } catch (error) {
    console.log(error)
    res.status(500).json({message:error.message})
   }
   
})

//server
const port = 8000
app.listen(port,()=>{
    console.log('Listening port'+ port)
})