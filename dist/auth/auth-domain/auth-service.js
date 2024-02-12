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
exports.authService = void 0;
const auth_repository_1 = require("../auth-repository/auth-repository");
const bcrypt = require('bcrypt');
exports.authService = {
    authUser(authData) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExistLogin = yield auth_repository_1.authRepositories.authUser(authData);
            const res = yield auth_repository_1.authRepositories.getUserHash(authData);
            if (res && isExistLogin) {
                const passwordSalt = res.passwordSalt;
                const passwordHash = res.passwordHash;
                const newPasswordHash = yield bcrypt.hash(authData.password, passwordSalt);
                return newPasswordHash === passwordHash;
            }
            else {
                return false;
            }
        });
    }
};
//# sourceMappingURL=auth-service.js.map