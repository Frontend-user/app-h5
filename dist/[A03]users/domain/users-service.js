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
exports.usersService = void 0;
const users_repository_1 = require("../repository/users-repository");
const bcrypt = require('bcrypt');
exports.usersService = {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const passwordSalt = yield bcrypt.genSalt(10);
            const passwordHash = yield this.__generateHash(user.password, passwordSalt);
            let changeUserData = Object.assign({}, user);
            delete changeUserData.password;
            const userHashData = Object.assign(Object.assign({}, changeUserData), { 'passwordSalt': passwordSalt, 'passwordHash': passwordHash });
            console.log(userHashData, 'userHashData,');
            const userId = yield users_repository_1.usersRepositories.createUser(userHashData);
            if (!userId) {
                return false;
            }
            return userId;
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield users_repository_1.usersRepositories.deleteUser(id);
        });
    },
    __generateHash(password, salt) {
        return __awaiter(this, void 0, void 0, function* () {
            const hash = yield bcrypt.hash(password, salt);
            if (hash) {
                return hash;
            }
            return false;
        });
    },
    __generateSalt() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    },
};
//# sourceMappingURL=users-service.js.map