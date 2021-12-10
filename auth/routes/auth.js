import express from 'express';
import User from '../model/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs'; 
import { registerValidation, loginValidation }    from '../validation.js';
const router = express.Router();

router.post('/register', async (req, res)=> {

    //validate before creating 
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //checking if user exists 
    const emailExist = await User.findOne({email:req.body.email});
    if (emailExist) return res.status(400).send('Email already exist!');

    //hash passwords
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt); 

    
    //create new user 
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({user:user._id});

    }catch(err){
        res.status(400).send(err);

    }
});

//LOGIN
router.post ('/login', async (req, res)=>{
    //validation before login
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send (error.details[0].message);
        
       //email check
       const user = await User.findOne({email:req.body.email});
       if (!user) return res.status(400).send('Email or Password is Invalid!');
       
       //password check
       const validPass = await bcrypt.compare(req.body.password, user.password);
       if (!validPass) return res.status(400).send('Email or Password in Invalid');

       //create and assign a token
       const token =jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
       res.header('auth-token', token).send(token);

       
       

});
    

export default router;
