import {body, check} from "express-validator";

const usersEmailPattern =  /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
export const usersLoginValidation = body('login').trim().isString().isLength({min: 3, max: 10}).withMessage({
    message: 'login is wrong',
    field: 'login'
})

export const usersPasswordValidation = body('password').trim().isString().isLength({min: 6, max: 20}).withMessage({
    message: 'password is wrong',
    field: 'password'
})
export const authLoginOrEmailValidation = body('loginOrEmail').trim().isString().isLength({min:3, max:20}).withMessage({
    message: 'loginOrEmail is unvalid',
    field: 'loginOrEmail'
})
export const usersEmailValidation = body('email').trim().isString().withMessage({
    message: 'email is wrong',
    field: 'email'
}).matches(usersEmailPattern).withMessage({
    message: 'email pattern is wrong',
    field: 'email'
})

