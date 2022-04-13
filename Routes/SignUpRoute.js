const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const { body, validationResult } = require('express-validator');
const User = require('../models/users') 

/**
 * POST - Route Used to Sign Up User && Create New User Document in Database
 * @Params from Client Request
 * Email, Username, Password Used for Registering User
 */

usersRouter.post('/',
  [
    body('email').isEmail().trim().escape().normalizeEmail(),
    body('username').isLength({min:1}).trim().escape().matches(/^[a-zA-Z\s]*$/  ),
    body('password').matches(/^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{8,}$/).trim().escape()
  ], 
  async (req,res) => {

  // Check for Validation & Sanitization Errors 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({errors:errors.array()});
  }

  const {username,password,email} = req.body

  console.log('username',username)

  // Check To See If User Already Exists 
  const currentuser = await User.findOne({ email })
  if(currentuser){
    return res.status(400).json({
      error: 'Email already registered in database.'
    })
  }
  // Hash Password & Respond with Token, Username, UserId
  const saltRounds = 10 
  const passwordHash = await bcrypt.hash(password,saltRounds)
  const user = new User({
    username,
    email,
    passwordHash,
  })

console.log('user.username',user.username)

  const savedUser = await user.save()
  const userForToken = {
    username: savedUser.username,
    id: savedUser._id,
  }
  console.log('userForToken.username',userForToken.username)
  // Create Token to Log User in After Sign Up 
  const token = jwt.sign(userForToken,process.env.SECRET, { expiresIn: 60*60 })
  console.log('token',token)
  // Send token with user name & user id.
  console.log('savedUser',savedUser)
  res.send({token,username: savedUser.username, userId: savedUser._id})
})
    
module.exports = usersRouter

