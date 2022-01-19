const express = require('express')
const cors = require('cors')
const app = express()


require('dotenv').config()
const Day = require('./mongo')
const { request } = require('express')
const res = require('express/lib/response')
app.use(cors())
app.use(express.json())


// Request Logger 
const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}
app.use(requestLogger)

// GET
app.get('/api/data',(req,res) => {
    Day.find({}).then(days =>{
      res.json(days)
    })
})

// GET BY SINGLE RESOURCE
app.get('/api/data/:id',(req,res) => {
  console.log(req.params.id)
  console.log('type of', typeof(req.params.id))
  Day.findById(req.params.id)
    .then((day) => {
      if (day) {
        res.json(day)
      } else {
        res.status(404).end()
      }
    })
  })

//Delete 
app.delete('/api/data/:id',(req,res) =>{
  Day.findByIdAndRemove(req.params.id)
  .then((day) => {
    console.log(day)
    res.status(204).end()
  })
})
    
// POST
app.post('/api/data', (req,res) => {
  const body = req.body;
  if(!body){
    return res.status(400).json({
      error: 'contnet missing'
    })
  }
  const day = new Day( {
    Sleep: body.Sleep,
    Work: body.Work,
    Exercise: body.Exercise,
    NGs: body.NGs,
    workRating: body.workRating,
    healthRating: body.healthRating,
    overall: body.overall,
    posNotes: body.posNotes,
    negNotes:body.negNotes,
    //Date: dateFns.format(new Date, 'yyyy/MM/dd'),
    Date: body.Date,
    //Createid: generateId(),
  })
  day.save().then(savedDay=>{
    res.json(savedDay)
  })
})

// EDIT // PUT



//APP LISTEN
const PORT = 3001
app.listen(PORT,() => {
  console.log(`Server running on port ${PORT}`);
})