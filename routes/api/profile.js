const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const User  = require('../../models/User');
const {check,validationResult} = require('express-validator');
const Post = require('../../models/Posts');


// //@route    GET api/profile
// //@desc     Test Route
// //@Access   Public

// router.get('/',(req,res)=>{
//     res.send('Profile Route');
// });




//@route    Get api/profile/me
//@desc     Get current user profile
//@Access   Private

router.get('/me',auth,async(req,res)=>{
    try{
        const profile = await Profile.findOne({user: req.user.id}).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({msg: 'No Profile found for this User'});
        }

        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




//@route    POST api/profile
//@desc     Create or Update User Profile
//@Access   Private

router.post('/',
[auth,
    [
    check('status','Status is Required').not().isEmpty(),
    check('skills','Skills is Required').not().isEmpty()
    ]
],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }


    const {company,website,location,bio,status,githubusername,
        skills,youtube,facebook,twitter,instagram,linkedin} = req.body;

    // Build Profile Object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if(skills){
        profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build Social Object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;



    try{
        
        let profile = Profile.findOne({user: req.user.id});

        // if(profile){
        //     //Update Profile
        //     profile = await Profile.findOneAndUpdate({user: req.user.id},{$set: profileFields},{new: true});
        //     return res.json(profile);
        // }
        
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }



});




//@route    GET api/profile
//@desc     Get all  Profiles
//@Access   Public

router.get('/',
async(req,res)=>{
    try {
        const profiles = await Profile.find().populate('user',['name','avatar']);
        res.json(profiles);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



//@route    GET api/profile/user/:user_id
//@desc     Get Profiles by User id
//@Access   Public

router.get('/user/:user_id',
async(req,res)=>{
    try {
        const profile = await Profile.findOne({user: req.params.user_id}).populate('user',['name','avatar']);

        if(!profile){
            return res.status(400).json({msg: 'No Profile found for this User'});
        }

        res.json(profile);
    } catch (err) {
        console.error(err.message);
        // If user id is not valid it should send No profile found error not server error so
        if(err.kind == 'ObjectId'){
            return res.status(400).json({msg: 'No Profile found for this User'});
        }
        res.status(500).send('Server Error');
    }
});




//@route    DELETE api/profile
//@desc     DELETE Profile, user & posts
//@Access   Private

router.delete('/',
auth,
async(req,res)=>{
    try 
    {   
        //Remove User Posts
        await Post.deleteMany({user: req.user.id});

        //Remove Profile
        await Profile.findOneAndRemove({user: req.user.id});            // Access to user.id bcz of token
        
        //Remove User
        await User.findOneAndRemove({_id: req.user.id});

        //Remove Posts
        
        res.json({msg: 'User Deleted'});
    } 
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});




//@route    PUT api/profile/experience
//@desc     Add Profile Experience
//@Access   Private

router.put('/experience',
[auth,[
    check('title','Title is Required').not().isEmpty(),
    check('company','Company is Required').not().isEmpty(),
    check('from','From Date is Required').not().isEmpty()
]],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {title,company,from,location,to,current,description}=req.body;

    const newExp = {title,company,from,location,to,current,description}             //Creates an object with data that user submits

    try {

        const profile = await Profile.findOne({user:req.user.id});

        profile.experience.unshift(newExp);                                           //Unshift - Works as Push but pushes in front instead of back

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }


});




//@route    DELETE api/profile/experience/:exp_id
//@desc     DELETE Experience from  Profile
//@Access   Private

router.delete('/experience/:exp_id',auth,async (req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});

        // Get Remove Index
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        profile.experience.splice(removeIndex,1);                       //Remove item

        await profile.save();

        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});







//@route    PUT api/profile/education
//@desc     Add Profile Education
//@Access   Private

router.put('/education',
[auth,[
    check('school','School is Required').not().isEmpty(),
    check('degree','Degree is Required').not().isEmpty(),
    check('fieldofstudy','Field of Study is Required').not().isEmpty(),
    check('from','From Date is Required').not().isEmpty()
]],
async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()});
    }

    const {school,degree,fieldofstudy,from,location,to,current,description}=req.body;

    const newEdu = {school,degree,fieldofstudy,from,location,to,current,description}             //Creates an object with data that user submits

    try {
        const profile = await Profile.findOne({user:req.user.id});

        profile.education.unshift(newEdu);                                           //Unshift - Works as Push but pushes in front instead of back

        await profile.save();

        res.json(profile);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }


});




//@route    DELETE api/profile/education/:edu_id
//@desc     DELETE Education from  Profile
//@Access   Private

router.delete('/education/:edu_id',auth,async (req,res)=>{
    try {
        const profile = await Profile.findOne({user:req.user.id});

        // Get Remove Index
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        profile.education.splice(removeIndex,1);                       //Remove item

        await profile.save();

        res.json(profile);
        
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;