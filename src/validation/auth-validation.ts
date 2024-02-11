import {NextFunction, Request, Response, ErrorRequestHandler} from "express";
const AUTH_CODE = 'YWRtaW46cXdlcnR5'
export const authorizationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    let requestAuthCode = req.headers.authorization
    if (!requestAuthCode || requestAuthCode.slice(6) !== AUTH_CODE) {
        res.sendStatus(401)
        return
    } else {
        next()
    }

}
