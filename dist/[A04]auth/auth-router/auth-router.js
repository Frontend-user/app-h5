"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const users_validation_1 = require("../../[A03]users/validation/users-validation");
const blogs_validation_1 = require("../../validation/blogs-validation");
const authValidators = [
    users_validation_1.usersPasswordValidation,
    users_validation_1.authLoginOrEmailValidation,
    blogs_validation_1.inputValidationMiddleware,
];
const express_1 = require("express");
const http_statuses_1 = require("../../constants/http-statuses");
const auth_service_1 = require("../auth-domain/auth-service");
exports.authRouter = (0, express_1.Router)({});
exports.authRouter.post('/login', ...authValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authData = {
            loginOrEmail: req.body.loginOrEmail,
            password: req.body.password,
        };
        const response = yield auth_service_1.authService.authUser(authData);
        if (!response) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_AUTH_401);
            return;
        }
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NO_CONTENT_204);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
//# sourceMappingURL=auth-router.js.map