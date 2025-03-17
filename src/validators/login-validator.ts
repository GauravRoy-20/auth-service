// import { body } from "express-validator"

// export default [body("email").notEmpty().withMessage("Email is required!")]

import { checkSchema } from "express-validator"

export default checkSchema({
    email: {
        trim: true,
        errorMessage: "Email is required!",
        notEmpty: true,
        isEmail: {
            errorMessage: "Email should be a valid email",
        },
    },
    password: {
        trim: true,
        errorMessage: "Last name is required!",
        notEmpty: true,
    },
})
