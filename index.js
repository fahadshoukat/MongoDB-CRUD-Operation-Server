const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors")
const UserModel = require("./models/Users");
require("dotenv").config();

app.use(express.json())
app.use(cors());

mongoose.connect(process.env.DATABASE);

app.post("/createUser", async (req, res) => {
    const user = req.body;
    console.log(user);
    const newUser = new UserModel(user);
    await newUser.save();
    res.json(user)
})

app.put('/editUser', (req, res) => {
    const {id, name, email, age, userName} = req.body;

    try {
        UserModel.findById(id, (error, user) => {
            user.name = name
            user.email = email
            user.age = age
            user.userName = userName
            user.save()
            res.send("User has been successfully updated in DB")
        })
    } catch (error) {
        res.send("Server Error from Update Data", error)
    }
})

app.delete("/deleteUser/:id", async (req, res) => {
    const id = req.params.id
    await UserModel.findByIdAndRemove(id).exec()
    res.send("User has been successfully deleted from DB")
})

app.get('/getUsers', (request, response) => {
    UserModel.find({}, (error, result) => {
        if(result){
            response.json(result)
        }else{
            response.json(error);
        }
    })
})
app.listen(process.env.PORT || 8000, () => {
    console.log("server is running.");
})