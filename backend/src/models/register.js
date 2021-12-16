const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const regSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

regSchema.methods.generateAuthToken = async function(){
    try{
        const token = await jwt.sign({_id:this._id.toString()},"mynameisjalauksinghmauryayoutuber",{
                    expiresIn : "1h"
                })
                console.log(token);
             this.tokens = this.tokens.concat({token:token})   
             await this.save();
             return token;
    }catch(e){
        console.log("the error part" + e);
        res.send("the error part" + e);

    }
}

regSchema.pre("save",async function(next){

    if(this.isModified("password")){
        // console.log(`the current : ${this.name}`)
        this.password = await bcrypt.hash(this.password,10)
        // console.log(`the hashed : ${this.name}`)
    }

    next();
})

const Register = new mongoose.model("Register",regSchema);
module.exports = Register;