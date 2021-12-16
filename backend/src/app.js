const express = require('express')
const app = express();
const port = process.env.PORT || 8000;
const bcrypt = require("bcryptjs")
const path = require("path");
const hbs = require("hbs")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const auth = require("./middleware/auth")
const authlogged = require("./middleware/authlogged")
require('./db/conn');
const Register = require("./models/register")

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const static_path = path.join(__dirname, "../public")
app.use(express.static(static_path))

const template_path = path.join(__dirname, "../templates/views")
const partials_path = path.join(__dirname, "../templates/partials")

app.set("view engine", "hbs")
app.set("views", template_path)
hbs.registerPartials(partials_path)


app.get("/",authlogged,(req, res) => {
        const name = req.user;
        res.render("index2",{name});
})

app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", async (req, res) => {
    try {

        const password = req.body.password;
        const cpassword = req.body.cpassword;

        if (password === cpassword) {
            const inputvalue = new Register({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                isAdmin:false
            });

            const token = await inputvalue.generateAuthToken();

            res.cookie("jwt",token,{
                expires:new Date(Date.now() + 30000),
                httpOnly:true
            })

            
            const registered = await inputvalue.save();
            res.status(201).render("index");
        }

        else{
            message={"type":"warning","intro":"password not matching"}
            res.status(402).render("register",{message});
        }
    } catch (e) {
        message={"type":"warning","intro":"user is already registered"}
        res.status(402).render("register",{message});
        
    }
})


app.get("/login",(req,res) => {
    res.render("login")
})

app.post("/login",async(req,res) => {
    try{
        
        const email = req.body.email;
        const password = req.body.password;
        // console.log(email,password)
        const user = await Register.findOne({email:email})
        // console.log(user)

        const name = user.name

        const isMatch = await bcrypt.compare(password,user.password);

        const token = await user.generateAuthToken();

        res.cookie("jwt",token,{
            expires:new Date(Date.now() + 500000),
            httpOnly:true,
            // secure:true
        })

       

        if(isMatch){
            res.status(201).render("index2",{name});
        }
        else{
            const message = {"type":"warning","intro":"invalid user"}
            res.render("login",{message});
        }

    }catch(e){
        const message = {"type":"warning","intro":"invalid user"}
        res.status(201).render("login",{message});
    }
})

app.get("/logout",auth,async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((curr) => {
            return curr.token != req.token 
        })
        res.clearCookie("jwt");
        await req.user.save();
        res.render('index')
    }catch(error){
        res.status(500).send(e)
    }
})

app.get("/library",auth,(req,res) => {
    const isAdmin = req.user.isAdmin;
    if(isAdmin){
        res.render("library")
    }
    else{
        res.render("college")
    }
})


app.listen(port, () => {
    console.log(`server is running at port no ${port}`);
})