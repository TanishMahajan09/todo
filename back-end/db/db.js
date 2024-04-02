const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://tanishmahajan0909:VIPQhHVwJELbcLDu@cluster.lea4krr.mongodb.net/tododb");

const userSchema = new mongoose.Schema({
    firstName:String,
    lastName:String,
    email:String,
    password:String,
    todos:[{
        title:String,
        description:String,
        isCompleted:Boolean,
        id:Number
    }]
});

const userModel = new mongoose.model('user',userSchema);
module.exports = {
    userModel
};