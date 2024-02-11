"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizationMiddleware = void 0;
const AUTH_CODE = 'YWRtaW46cXdlcnR5';
const authorizationMiddleware = (req, res, next) => {
    let requestAuthCode = req.headers.authorization;
    if (!requestAuthCode || requestAuthCode.slice(6) !== AUTH_CODE) {
        res.sendStatus(401);
        return;
    }
    else {
        next();
    }
};
exports.authorizationMiddleware = authorizationMiddleware;
//# sourceMappingURL=auth-validation.js.map