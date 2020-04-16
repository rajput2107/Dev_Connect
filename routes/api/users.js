const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const {check , validationResult} = require('express-validator');

const User = require('../../models/User');

//@route    POST api/users
//@desc     Register User
//@Access   Public

router.post('/',[
    check('name','Name is required').not().isEmpty(),
    check('email','Enter a valid Email').isEmail(),
    check('password','Enter a valid Password with more than 6 chars').isLength({min:6})
],
async (req,res)=>{
    // console.log(req.body);                                                               // Body Parser needed
    const errors = validationResult(req);
    if(!errors.isEmpty()){                                                                   // If there r errors
        return res.status(400).json({errors:errors.array()});                             // Send back json to Show errors
    }


    const {name,email,password} = req.body;                                         
    try{

    //See if User exists
        let user = await User.findOne({email});                                     // Find User by email

        if(user){
           return res.status(400).json({errors:[{msg:'User Already Exists'}]});     // Format error same as json err above
        }


    //Get User Gravatar
        const avatar = gravatar.url(email,{
            s: '200',                                                           // Size
            r: 'pg',                                                            // Rating
            d: 'mm'                                                             // Default
        })
            //Create instance of user (not save in db)
            user = new User({
                name,
                email,
                avatar,
                password
            });

    //Encrypt Password
            //Create a var to do the hashing
            const salt = await bcrypt.genSalt(10);              // More the no. more secured but 10 is suitable

        user.password = await bcrypt.hash(password,salt);       // Create hash of pswd and update user pswd 
        
        await user.save();                                      // Save user to db

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




// //@route GET api/users

// router.get('/',(req,res)=>{
//     res.send('Users Route');
// });

module.exports = router;