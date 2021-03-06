const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const { body, validationResult } = require('express-validator');
const User = require('../models/users')


/**
 * POST - Route Used to Login Suer
 * @Params from Client Request
 * Email, Password to Login
 */
loginRouter.post('/', 
    [
        body('email').isEmail().trim().escape().normalizeEmail(),
        body('password').trim().escape()
    ], 
    async (req,res) => {

    const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({errors:errors.array()});
    }

    const {password,email} = req.body
    const user = await User.findOne({ email })
    if(!user){
        return res.status(401).json({
            error: 'Email is not registered with Habits.'
        })
    }
    const passwordCorrect =  await bcrypt.compare(password, user.passwordHash)
    // Password Incorrect 
    if(!passwordCorrect){
        return res.status(401).json({
            error: 'Incorrect Password.'
        })
    }
    // UserName & Email Pass
    const userForToken = {
        username: user.username,
        id: user._id
    }    
    // Sign Token 
    const token = jwt.sign(userForToken,process.env.SECRET, { expiresIn: 60*60 })
    res
        .status(200)
        .send({token,username: user.username, name:user.name, userId: user._id,habitId: user.habitDocId})
})
module.exports = loginRouter


// to do
// sanatize
// error handle

