require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");

function userMiddleware(req,res,next){
    let auth = req.headers.authorization;
    if(auth == undefined){
        return;
    }
    console.log(auth);
    let validate = jwt.verify(auth,jwtSecret);
    if(!validate){
        return res.status(403).json({
            msg:"Invalid credentials"
        })
    }
    next();
}

module.exports = userMiddleware;