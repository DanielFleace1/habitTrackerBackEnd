const mongoose = require('mongoose')

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
    user:{
      type:mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
})

daySchema.set('toJSON',{
    transform:(document,returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject.__v
      delete returnedObject._id
    }
})

module.exports = mongoose.model('Day',daySchema)