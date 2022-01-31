const daysRouter = require ('express').Router()
const User = require('../models/users')
const Day = require('../models/day') 
const jwt = require('jsonwebtoken')

// isolates the token from the authorization header. 
const getTokenFrom = (req) => {
  const authorization = req.get('authorization')
  if(authorization && authorization.toLowerCase().startsWith('bearer ')){
    return authorization.substring(7)
  }
  return null
}

daysRouter.get('/',async (req,res)=>{ 
  const token = getTokenFrom(req)
  const decodedToken = jwt.verify(token,process.env.SECRET)
  if(!decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  const days = await Day
    .find({user: decodedToken.id})
    res.json(days)  
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
daysRouter.post('/',  async (req,res) => {
  const body = req.body;
  const token = getTokenFrom(req);
  // verify validity of tokens
  const decodedToken = jwt.verify(token, process.env.SECRET)
  console.log(decodedToken)
  if(!decodedToken.id){
    return response.status(401).json({ error: 'token missing or invalid' })
  }
  console.log('body . userId',body.userId)
  const user = await User.findById(body.userId)  
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
      user: user._id
    })
    day.save()
      .then(savedDay=>{
        console.log('1')
        user.days = user.days.concat(savedDay._id)
        console.log('2')
        user.save()
          .then(result =>{
            res.json(savedDay)
            console.log(savedDay)
          })          
      })
    })
    
daysRouter.put('/:id',(req,res) => {
    const body = req.body
    console.log(body)
    const day = {
      Sleep: body.Sleep,
      Work: body.Work,
      Exercise: body.Exercise,
      NGs: body.NGs,
      workRating: body.workRating,
      healthRating:body.healthRating,
      overall: body.overall,
      posNotes: body.posNotes,
      negNotes: body.negNotes,
      Date: body.Date,
    }
    Day.findByIdAndUpdate(req.params.id,day,{new:true})
      .then(updatedDay =>{
        if(updatedDay){
          res.json(updatedDay)
        }
        else{
          console.log('error no updated day')
        }
      })
  })

module.exports = daysRouter
