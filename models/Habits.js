
const mongoose = require('mongoose');

// One document per user approach
const habitSchema = new mongoose.Schema({
   userId: String, 
   habitAry:[
      {
         habitType:String,
         habitName: String,
         habitData:[{ value: String || Number, date: Date }],
         // this needs to have an id.
      }
   ]
})
habitSchema.set('toJSON',{
   transform:(document,returnedObject) => {
       returnedObject.id = returnedObject._id.toString()
       delete returnedObject._id
       delete returnedObject._v
   }
})

const Habit = mongoose.model('Habit', habitSchema);
module.exports = Habit

