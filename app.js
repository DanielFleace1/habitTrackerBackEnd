const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const daysRouter = require('./Routes/old/daysRouter')
const usersRouter = require('./Routes/SignUpRoute')
const loginRouter = require('./Routes/LoginRoute')
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose')
const habitsRouter = require('./Routes/HabitsRouter')
 
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/api/data',daysRouter)
app.use('/api/signup',usersRouter)
app.use('/api/login',loginRouter)
app.use('/api/habits',habitsRouter)

module.exports = app