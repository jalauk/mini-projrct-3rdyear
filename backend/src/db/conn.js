const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/userinfo").then(() => {
    console.log("connected to database")
}).catch((e) => {
    console.log(e);
})