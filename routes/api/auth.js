const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const {check , validationResult} = require('express-validator');
const User = require('../../models/User');
const gravatar = require('gravatar');


//@route GET api/auth

router.get('/',auth,async(req,res)=>{
    try{
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


//@route    POST api/auth
//@desc     Authenticate User to Login & get Token
//@Access   Public

router.post('/',[
    check('email','Enter a valid Email').isEmail(),
    check('password','Password is required').exists()
],
async (req,res)=>{
    // console.log(req.body);                                                               // Body Parser needed
    const errors = validationResult(req);
    if(!errors.isEmpty()){                                                                // If there r errors
        return res.status(400).json({errors:errors.array()});                             // Send back json to Show errors
    }


    const {email,password} = req.body;                                         
    try{

    //See if User exists
    let user = await User.findOne({email});                                     // Find User by email

        if(!user){
           return res.status(400).json({errors:[{msg:'Invalid Credentials'}]});     // If user not found in db
        }

    // Match password
    const isMatch = await bcrypt.compare(password,user.password);       // Compare curr pswd give by user with encrypted
                                                                        // pswd stored in db

    if(!isMatch){
        return res.status(400).json({errors:[{msg:'Invalid Credentials'}]}); 
    }                                                                        

    //Return jsonwebtoken
    const payload={
        user:{                                                  // MongoDB _id but in mongoose they do 
            id: user.id                                         // abstraction so you can use .id
        }
    }

    jwt.sign(
        payload,
        config.get('jwtSecret'),
        {expiresIn:3600},                                       //Expire token in 1hr
        (err,token)=>{
        if(err) throw err;                                      
        res.json({token});                                      // If no error then send token back to client
        }
    );     



    //res.send('User Registered');
    }

    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;