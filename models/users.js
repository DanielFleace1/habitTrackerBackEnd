const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    passwordHash: String,
    days:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Day'
    }],
})

userSchema.set('toJSON',{
    transform:(document,returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject._v
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User