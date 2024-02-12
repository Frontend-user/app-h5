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
exports.usersRepositories = void 0;
const db_1 = require("../../repositories/db");
exports.usersRepositories = {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield db_1.usersCollection.insertOne(user);
            return response ? response.insertedId : false;
        });
    },
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield db_1.usersCollection.find({}).toArray();
            console.log(users, 'users');
            console.log(users.length, 'users');
            const response = yield db_1.usersCollection.deleteOne({ _id: id });
            const usersAfterDelete = yield db_1.usersCollection.find({}).toArray();
            const usersToDelete = yield db_1.usersCollection.findOne({ _id: id });
            console.log(usersAfterDelete, 'usersAfterDelete');
            console.log(usersAfterDelete.length, 'usersAfterDelete');
            console.log(usersToDelete, 'usersToDelete');
            return !!response.deletedCount;
        });
    }
};
//# sourceMappingURL=users-repository.js.map