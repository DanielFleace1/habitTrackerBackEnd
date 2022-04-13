const habitsRouter = require('express').Router();
const User = require('../models/users');
const Habit = require('../models/Habits');
const jwt = require('jsonwebtoken');
const { body } = require('express-validator');

/**
* Helper Function to check Authorization
*/
const getTokenFrom = (req) => {
    const authorization = req.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')){
      return authorization.substring(7)
    }
    return null
}

/**
 * POST  - Create Habit Document to store user Data. Each user will have one document 
 * Description: Called from Client after User Initially Signs Up. This Should be the Only Time it is Called.
 * PARAMS from Client Request
 * @userId - Used to Reference Create Reference Between User Document & Habits Document
 */

habitsRouter.post('/' , 
   [ body('userId').trim().escape()],
   async (req,res) => {
    // Check Authorization
    try{
        const token = getTokenFrom(req)
            if(!token){
                return res.status(401).json({ error: 'token missing' })
            }
            const decodedToken = jwt.verify(token,process.env.SECRET)
            if(!decodedToken.id){
                return response.status(401).json({ error: 'token missing or invalid' })
            }
    }
    catch(err){
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    // Destruct Body
    const{userId} = req.body  
    // Find User in Database & Create New Habit Document Found. Else Return Error
    const user = await User.findById(userId) 
    if(!user){
        return res.status(400).json({
            error: 'UserId not found in User Collection in Database'
        })
    }
    const habit = new Habit({userId:userId,})
    // Saved New Habit Document && Save habit._id to user habits array.
    habit.save()
        .then(savedHabit=> {
            user.habitDocId = savedHabit._id;
            user.save()
                .then(result =>{
                    res.json(result)
                })
        })
})




/**
 * PUT  - Add to New Habit To Existing Document OR Add Data to Current Habit 
 * @PARAMS
 * NewHabitData - Habit Data to Add to Existing Habitx          . If Null PUT Method will Add New Habit to Document - From Body
 * Habit Name - User Defined Name / Description To Track - From Body
 * Habit Type - User Define Tracking Measure - From Body
 * HabitId - Find User Document - URL Parameter
 */

habitsRouter.put('/:id', 
    [
    body('habitName').trim().escape(),
    body('habitType').trim().escape()
    ]
    ,async(req,res) => {
    // Check Authorization

    try{
        const token = getTokenFrom(req)

        if(!token){
            return res.status(401).json({ error: 'token missing' })
        }
        const decodedToken = jwt.verify(token,process.env.SECRET)

        if(!decodedToken.id){
            return response.status(401).json({ error: 'token missing or invalid' })
        }
    }
    catch(err){
        return res.status(401).json({ error: 'token missing or invalid' })
    }

    // Destruct Body & Find User in Database that is Making Post. 
    const{habitName,habitType, newHabitData} = req.body  



    const habitId = req.params.id

    // new object containing new habit
    const habit = await Habit.findById(habitId)

    if(!newHabitData){
        const newHabit ={
            habitName,
            habitType,
        }
        habit.habitAry.push(newHabit)
    }
    else{
        // Else Add new Habit Data To Document 
        // Loop incoming data
        newHabitData.forEach((newobj) => {
            // Loop habit array in document to find matching id
            habit.habitAry.forEach((obj) => {
                if(newobj.id === obj.id){
                    // If incoming obj id === id in Habit Array
                    // Create Incoming Data to be Entered
                    let newData = {
                        value: newobj.value,
                        date: newobj.Date,
                    }
                    let counter = 0;
                    // Look to see if Date of incoming data has already been entered to habit in habit document.
                    obj.habitData.forEach(obj2=>{        
                        
                        // if(newobj.Date == obj2.date.toISOString().slice(0,10)){// old
                        if(newobj.Date == obj2.date){
                            // If there is already an entry for the entered date. Replace value 
                            obj2.value = newData.value
                            counter --;
                        }
                        if(counter === obj.habitData.length-1){
                            // If the habit array is looped and  date does not exist. Add new data
                            obj.habitData.push(newData); 
                        }
                        counter ++
                    })
                    //  Handle if Habit Data is Empty 
                    if(!obj.habitData[0]){
                        obj.habitData.push(newData); 
                    }
                }
            })
        })
    }

    // Save Habit to Db & send Saved Habit as Response 
    habit.save()
        .then(savedHabit=> {
            res.json(savedHabit)
        })
})

/**
 * GET - Get Habit Data for a specific User across a specific Date Range
 * PARAMS
 * HabitID - used to find document in database -URL Parameter
 */

 habitsRouter.get('/:id', 
 [
 body('habitName').trim().escape(),
 body('habitType').trim().escape()
 ]
 ,async(req,res) => {
    // Check Authorization
    try{
        const token = getTokenFrom(req)
        if(!token){
            return res.status(401).json({ error: 'token missing' })
        }
        const decodedToken = jwt.verify(token,process.env.SECRET)

        if(!decodedToken.id){
            return response.status(401).json({ error: 'token missing or invalid' })
        }
    }
    catch(err){
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const habitId = req.params.id
    
    Habit.findById(habitId)
        .then((habit) =>{
            res.json(habit)
        })
        .catch((err) => {
            res.status(404).end()
        })
 })

 /**
 * DELETE - Delete a Specific Habit in Habit Document habitAry
 * HabitId - Find Habit Document for User. URL Parameter
 * habitAryIdObj.habitAryId - Find the Specific Habit in the HabitAry  to Delete
 */

  habitsRouter.delete('/:id', 
  [
     body('habitAryIdObj.habitAryId').trim().escape()
  ]
  ,async(req,res) => {
    // Check Authorization
    try{
        const token = getTokenFrom(req)
        if(!token){
            return res.status(401).json({ error: 'token missing' })
        }
        const decodedToken = jwt.verify(token,process.env.SECRET)

        if(!decodedToken.id){
            return response.status(401).json({ error: 'token missing or invalid' })
        }
    }
    catch(err){
        return res.status(401).json({ error: 'token missing or invalid' })
    }
    const habitId = req.params.id
    const habitAryId = req.body.habitAryIdObj.habitAryId

    Habit.findById(habitId)
    .then((habit) =>{
        const newAry = habit.habitAry.filter(elm => elm._id.toString() !== habitAryId)
        habit.habitAry = newAry;
        habit.save()
            .then(newHabit=>{
                res.json(newHabit)
            })
    })
    .catch((err) => {
        res.status(404).end()
    })    
  })

module.exports = habitsRouter


//*** CURRENT WORKING METHOD */
    //    newHabitData.forEach((newobj) => {
    //         habit.habitAry.forEach((obj) => {
    //             if(newobj.id === obj.id){
    //                 let newObj2 = {
    //                     value: newobj.value,
    //                     date: newobj.Date,
    //                 }
    //                 obj.habitData.push(newObj2)
    //             }
    //         })   
    //     })