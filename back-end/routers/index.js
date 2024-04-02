const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const userMiddleware = require("../middleware/userMiddleware");
require("dotenv").config();
const jwtSecret = process.env.JWT_SECRET;
const { userModel } = require("../db/db.js");
const {
  signUpSchema,
  signInSchema,
  addingTodoSchema,
} = require("../zod/types.js");

router.post("/signin", async (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  let obj = {
    email,
    password,
  };
  let ans = signInSchema.safeParse(obj);
  if (!ans) {
    return res.status(411).json({
      msg: "wrong inputs",
    });
  } else {
    let user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(403).json({
        msg: "User does not exist",
      });
    } else {
      if (user.password !== password) {
        return res.status(403).json({
          msg: "Invalid credentials",
        });
      } else {
        let token = jwt.sign({ email: email }, jwtSecret);
        return res.status(200).json({
          token: token,
        });
      }
    }
  }
});

router.post("/signup", async (req, res) => {
  let { firstName, lastName, email, password } = req.body;
  let obj = {
    firstName,
    lastName,
    email,
    password,
  };
  let validate = signUpSchema.safeParse(obj);
  if (!validate) {
    res.status(411).json({
      msg: "Wrong inputs",
    });
  } else {
    const vali = await userModel.findOne({ email: email });
    if (vali) {
      return res.json({
        msg: "User already exists",
      });
    }
    const user = await userModel.create({
      firstName,
      lastName,
      email,
      password,
    });
    let token = jwt.sign({ email: email }, jwtSecret);
    return res.status(200).json({
      token: token,
    });
  }
});

router.get("/todo", userMiddleware, async (req, res) => {
  let auth = req.headers.authorization;
  let email = jwt.decode(auth, jwtSecret).email;
  let user = await userModel.findOne({ email: email });
  return res.json({
    list: user.todos,
  });
});

router.post("/todo", userMiddleware, async (req, res) => {
  let auth = req.headers.authorization;
  let email = jwt.decode(auth, jwtSecret).email;
  let user = await userModel.findOne({ email: email });
  let title = req.body.title;
  let description = req.body.description;
  let objToBeVerified = {
    title,
    description,
  };
  let validate = addingTodoSchema.safeParse(objToBeVerified);
  if (!validate) {
    res.status(411).json({
      msg: "Send the right format",
    });
  } else {
    let length = user.todos.length+1;
    let obj = {
      title: title,
      description: description,
      isCompleted: false,
      id:length
    };
    user.todos.push(obj);

    await user.save();
    return res.json({
      msg: "todo added",
    });
  }
});

router.put("/todo:id", userMiddleware, async (req, res) => {
  let auth = req.headers.authorization;
  let email = jwt.decode(auth, jwtSecret).email;
  let id = req.params.id;

  const user = await userModel.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: "User not found" });
  }
  const todoIndex = user.todos.findIndex(todo => todo.id === Number(id));
  if (todoIndex === -1) {
    return res.status(404).json({ msg: "Todo not found" });
  }

  // Update isCompleted field to true for the todo with the specified ID
  user.todos[todoIndex].isCompleted = true;

  await user.save();
  return res.json({ msg: "Todo marked as completed" });

});

module.exports = router;
