const daysRouter = require ('express').Router()
const Day = require('../models/day') // this will change

daysRouter.get('/',(req,res)=>{
    Day.find({}).then(day =>{
        res.json(day)
    })
})

daysRouter.get('/:id',(req,res) => {
    Day.findById(req.params.id)
    .then((day) => {
    if (day) {
        res.json(day)
    } 
    else {
        res.status(404).end()
    }
    })
})

daysRouter.delete('/:id',(req,res) =>{
    Day.findByIdAndRemove(req.params.id)
    .then((day) => {
        res.status(204).end()
    })
})

// POST
daysRouter.post('/', (req,res) => {
    const body = req.body
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
    Date: body.Date,
  })
  day.save().then(savedDay=>{
    res.json(savedDay)
  })
})

module.exports = daysRouter
