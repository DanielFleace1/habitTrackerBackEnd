const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const daysRouter = require('./controllers/daysRouter')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const mongoose = require('mongoose')
 
mongoose.connect(config.MONGODB_URI)
    .then(() => {
      console.log('connected to MongoDB')
    })
    .catch((err)=>{
        console.log('error:', err)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use('/api/data',daysRouter)
app.use('/api/users',usersRouter)
app.use('/api/login',loginRouter)

module.exports = app