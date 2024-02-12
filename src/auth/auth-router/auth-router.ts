import {
    authLoginOrEmailValidation,
    usersPasswordValidation
} from "../../users/validation/users-validation";
import {inputValidationMiddleware} from "../../validation/blogs-validation";

const authValidators = [
    usersPasswordValidation,
    authLoginOrEmailValidation,
    inputValidationMiddleware,
]
import {Router, Request, Response} from "express";
import {HTTP_STATUSES} from "../../common/constants/http-statuses";
import {authService} from "../auth-domain/auth-service";
import {AuthType} from "../auth-types/auth-types";

export const authRouter = Router({})


authRouter.post('/login',
    ...authValidators,
    async (req: Request, res: Response) => {
        try {
            const authData: AuthType = {
                loginOrEmail: req.body.loginOrEmail,
                password: req.body.password,
            }
            const response = await authService.authUser(authData)
            if (!response) {
                res.sendStatus(HTTP_STATUSES.NOT_AUTH_401)
                return
            }
            res.sendStatus(HTTP_STATUSES.NO_CONTENT_204)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    })


