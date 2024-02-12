"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersEmailValidation = exports.authLoginOrEmailValidation = exports.usersPasswordValidation = exports.usersLoginValidation = void 0;
const express_validator_1 = require("express-validator");
const usersEmailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
exports.usersLoginValidation = (0, express_validator_1.body)('login').trim().isString().isLength({ min: 3, max: 10 }).withMessage({
    message: 'login is wrong',
    field: 'login'
});
exports.usersPasswordValidation = (0, express_validator_1.body)('password').trim().isString().isLength({ min: 6, max: 20 }).withMessage({
    message: 'password is wrong',
    field: 'password'
});
exports.authLoginOrEmailValidation = (0, express_validator_1.body)('loginOrEmail').trim().isString().isLength({ min: 3, max: 20 }).withMessage({
    message: 'loginOrEmail is unvalid',
    field: 'loginOrEmail'
});
exports.usersEmailValidation = (0, express_validator_1.body)('email').trim().isString().withMessage({
    message: 'email is wrong',
    field: 'email'
}).matches(usersEmailPattern).withMessage({
    message: 'email pattern is wrong',
    field: 'email'
});
//# sourceMappingURL=users-validation.js.map