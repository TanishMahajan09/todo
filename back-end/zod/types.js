const zod = require("zod");

const signUpSchema = zod.object({
    firstName:zod.string().min(2).max(50),
    lastName:zod.string().min(2).max(50),
    email:zod.string().email(),
    password:zod.string().min(8)
})

const signInSchema = zod.object({
    email:zod.string().email(),
    password:zod.string().min(8)
});

const addingTodoSchema = zod.object({
    title:zod.string(),
    description:zod.string()
});

module.exports = {
    signInSchema,
    signUpSchema,
    addingTodoSchema
};