const yup = require('yup');

const bodySchema = yup.object().shape({
    username: yup
        .string()
        .trim()
        .typeError("username and password required")
        .required("username and password required")
        .min(4, 'Username must be at least 4 charactes')
        .max(50, 'Username cant be more than 50 characters'),
    password: yup
        .string()
        .trim()
        .typeError("username and password required")
        .required("username and password required")
        .min(8, 'Password must be at least 8 characters')
})

module.exports = bodySchema;