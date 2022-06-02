const yup = require('yup');

const bodySchema = yup.object().shape({
    username: yup
        .string()
        .trim()
        .typeError("username and password required")
        .required("username and password required")
        .max(50, 'Username cant be more than 50 characters'),
    password: yup
        .string()
        .trim()
        .typeError("username and password required")
        .required("username and password required")
})

module.exports = bodySchema;