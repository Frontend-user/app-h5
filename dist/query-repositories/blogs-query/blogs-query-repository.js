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
exports.blogsQueryRepository = void 0;
const db_1 = require("../../repositories/db");
const mongodb_1 = require("mongodb");
const blogs_sorting_1 = require("./utils/blogs-sorting");
const blogs_finding_1 = require("./utils/blogs-finding");
const blogs_paginate_1 = require("./utils/blogs-paginate");
exports.blogsQueryRepository = {
    getBlogs(searchNameTerm, sortBy, sortDirection, pageNumber, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            const findQuery = blogs_finding_1.blogsFinding.getFindings(searchNameTerm);
            const sortQuery = blogs_sorting_1.blogsSorting.getSorting(sortBy, sortDirection);
            const paginateQuery = blogs_paginate_1.blogsPaginate.getPagination(pageNumber, pageSize);
            //
            let blogs = yield db_1.blogsCollection.find(findQuery).sort(sortQuery).skip(paginateQuery.skip).limit(paginateQuery.limit).toArray();
            console.log(searchNameTerm, 'ser');
            // const allBlogs = await blogsCollection.find({name:{$regex: searchNameTerm, $options: 'i'}}).sort(sortQuery).toArray()
            const allBlogs = yield db_1.blogsCollection.find(findQuery).sort(sortQuery).toArray();
            // console.log(allBlogs,'aalk')
            let pagesCount = 0;
            if (!pageSize) {
                pageSize = 10;
            }
            if (!pageNumber) {
                pageNumber = 1;
            }
            pagesCount = Math.ceil(allBlogs.length / pageSize);
            const fixArrayIds = blogs.map((item => this.__changeIdFormat(item)));
            const response = {
                "pagesCount": pagesCount,
                "page": pageNumber,
                "pageSize": pageSize,
                "totalCount": allBlogs.length,
                "items": fixArrayIds
            };
            return response;
        });
    },
    getBlogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(id, 'id');
            if (mongodb_1.ObjectId.isValid(id) && typeof id === 'string' || id instanceof mongodb_1.ObjectId) {
                const blog = yield db_1.blogsCollection.findOne({ _id: new mongodb_1.ObjectId(id) });
                console.log(blog, 'blog');
                return blog ? this.__changeIdFormat(blog) : false;
            }
            return false;
        });
    },
    __changeIdFormat(obj) {
        obj.id = obj._id;
        delete obj._id;
        return obj;
    }
    //filter
    //types for presentation sloy
    //pagination sorting type for frontend
};
//# sourceMappingURL=blogs-query-repository.js.map