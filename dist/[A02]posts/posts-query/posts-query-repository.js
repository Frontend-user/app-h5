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
exports.postsQueryRepository = void 0;
const db_1 = require("../../repositories/db");
const mongodb_1 = require("mongodb");
const blogs_sorting_1 = require("../.././[A01]blogs/blogs-query/utils/blogs-sorting");
const blogs_paginate_1 = require("../.././[A01]blogs/blogs-query/utils/blogs-paginate");
exports.postsQueryRepository = {
    getPosts(sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortQuery = blogs_sorting_1.blogsSorting.getSorting(sortBy, sortDirection);
            const paginateQuery = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            let posts = yield db_1.postsCollection.find({}).sort(sortQuery).skip(paginateQuery.skip).limit(paginateQuery.limit).toArray();
            const allPosts = yield db_1.postsCollection.find({}).sort(sortQuery).toArray();
            let pagesCount = 0;
            if (!pageSize) {
                pageSize = 10;
            }
            if (!pageNumber) {
                pageNumber = 1;
            }
            pagesCount = Math.ceil(allPosts.length / pageSize);
            const fixArrayIds = posts.map((item => this.__changeIdFormat(item)));
            const response = {
                "pagesCount": pagesCount,
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": allPosts.length,
                "items": fixArrayIds
            };
            return response;
            // const [A02]posts:PostEntityType[] = await postsCollection.find({}).toArray();
            // const fixArrayIds:PostViewType[] = [A02]posts.map((item => this.__changeIdFormat(item)))
            // return fixArrayIds.length > 0 ? fixArrayIds:  []
        });
    },
    getPostsByBlogId(blogId, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const sortQuery = blogs_sorting_1.blogsSorting.getSorting(sortBy, sortDirection);
            const paginateQuery = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            let posts = yield db_1.postsCollection.find({ "blogId": blogId }).sort(sortQuery).skip(paginateQuery.skip).limit(paginateQuery.limit).toArray();
            const allPosts = yield db_1.postsCollection.find({ "blogId": blogId }).toArray();
            let pagesCount = 0;
            if (!pageSize) {
                pageSize = 10;
            }
            if (!pageNumber) {
                pageNumber = 1;
            }
            pagesCount = Math.ceil(allPosts.length / pageSize);
            const fixArrayIds = posts.map((item => this.__changeIdFormat(item)));
            const response = {
                "pagesCount": pagesCount,
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": allPosts.length,
                "items": fixArrayIds
            };
            return response;
        });
    },
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield db_1.postsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
            return post ? this.__changeIdFormat(post) : false;
        });
    },
    __changeIdFormat(obj) {
        obj.id = obj._id;
        delete obj._id;
        return obj;
    }
};
//# sourceMappingURL=posts-query-repository.js.map