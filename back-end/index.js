const express = require("express");
const app = express()
const PORT = 5000;
const cors = require("cors"); 

app.use(cors({
    origin:"http://localhost:5173"
}));
app.use(express.json());


const userRoute = require('./routers/index.js');
app.use("/",userRoute);

app.listen(PORT,(err)=>{
    if(err){console.log(err)}
    console.log(`App is listening on port ${PORT}`);
})