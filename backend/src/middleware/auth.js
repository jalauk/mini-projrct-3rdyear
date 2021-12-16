const jwt = require("jsonwebtoken")
const Register = require("../models/register")

const auth = async (req,res,next) =>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,"mynameisjalauksinghmauryayoutuber")

        console.log(`verifyuser : ${verifyUser}`);

        const user = await Register.findOne({_id:verifyUser._id})
        console.log(user);

        req.token = token;
        req.user = user;
        next();
    }catch(e){
        res.status(201).render("register");
        console.log(e);
    }
}





module.exports = auth;
