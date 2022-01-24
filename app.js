const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const daysRouter = require('./controllers/daysRouter')

// Request Logger 
const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
 
mongoose.connect(config.MONGODB_URI)
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((err)=>{
        console.log('error:', err)
    })
    
app.use('/api/data',daysRouter)
app.use(cors())
// app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
module.exports = app