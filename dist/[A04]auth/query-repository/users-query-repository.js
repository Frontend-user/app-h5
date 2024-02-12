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
exports.usersQueryRepository = void 0;
const blogs_sorting_1 = require("../../[A01]blogs/blogs-query/utils/blogs-sorting");
const blogs_paginate_1 = require("../../[A01]blogs/blogs-query/utils/blogs-paginate");
const db_1 = require("../../repositories/db");
exports.usersQueryRepository = {
    getUsers(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const findQuery = this.__getUsersFindings(searchNameTerm);
            const sortQuery = blogs_sorting_1.blogsSorting.getSorting(sortBy, sortDirection);
            const paginateQuery = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            let users = yield db_1.usersCollection.find(findQuery).sort(sortQuery).skip(paginateQuery.skip).limit(paginateQuery.limit).toArray();
            const allUsers = yield db_1.usersCollection.find(findQuery).sort(sortQuery).toArray();
            let pagesCount = 0;
            if (!pageSize) {
                pageSize = 10;
            }
            if (!pageNumber) {
                pageNumber = 1;
            }
            pagesCount = Math.ceil(allUsers.length / pageSize);
            const fixArrayIds = users.map((user => this.__changeIdFormat(user)));
            const response = {
                "pagesCount": pagesCount,
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": users.length,
                "items": fixArrayIds
            };
            return response;
        });
    },
    getUserById(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const getUser = yield db_1.usersCollection.findOne({ _id: userId });
            return getUser ? this.__changeIdFormat(getUser) : false;
        });
    },
    __changeIdFormat(obj) {
        obj.id = obj._id;
        delete obj._id;
        delete obj.password;
        return obj;
    },
    __getUsersFindings(searchNameTerm) {
        let findQuery = {};
        if (searchNameTerm) {
            findQuery["login"] = { $regex: searchNameTerm, $options: 'i' };
        }
        return findQuery;
    },
};
//# sourceMappingURL=users-query-repository.js.map