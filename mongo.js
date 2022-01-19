const mongoose = require('mongoose')
//import { format, set } from 'date-fns'

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url)
    .then(result =>{
        console.log('connected to mongo');
    })
    .catch((error) => {
        console.log('error connecting to MongoDB:', error.message)
    })

const daySchema = new mongoose.Schema({
    Sleep: Number ,
    Work: Number,
    Exercise: String,
    NGs: String,
    workRating:Number,
    healthRating: Number,
    overall: Number,
    posNotes:String,
    negNotes:String,
    Date: String, 
    id: String,
})


// whats this 

daySchema.set('toJSON',{
    transform:(document,returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject.__v
      delete returnedObject._id
    }
})

module.exports = mongoose.model('day',daySchema)