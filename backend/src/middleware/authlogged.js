const jwt = require("jsonwebtoken")
const Register = require("../models/register")


const authlogged = async (req,res,next) =>{
    try{
        const token = req.cookies.jwt;
        const verifyUser = jwt.verify(token,"mynameisjalauksinghmauryayoutuber")
        
        // console.log(`verifyuser : ${verifyUser}`);

        const user = await Register.findOne({_id:verifyUser._id})
        // console.log(user);

        req.token = token;
        req.user = user.name;
        next();

    }catch(e){
        res.status(201).render("index");
        console.log(e);
    }
}

module.exports = authlogged;