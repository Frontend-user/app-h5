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
exports.postsRouter = exports.postValidators = void 0;
const express_1 = require("express");
const auth_validation_1 = require("../../validation/auth-validation");
const posts_validation_1 = require("../../validation/posts-validation");
const blogs_validation_1 = require("../../validation/blogs-validation");
const http_statuses_1 = require("../../common/constants/http-statuses");
const mongodb_1 = require("mongodb");
const posts_service_1 = require("../domain/posts-service");
const posts_query_repository_1 = require("../posts-query/posts-query-repository");
const blogs_query_repository_1 = require("../../blogs/blogs-query/blogs-query-repository");
exports.postValidators = [
    auth_validation_1.authorizationMiddleware,
    posts_validation_1.postTitleValidation,
    posts_validation_1.postDescValidation,
    posts_validation_1.postContentValidation,
    posts_validation_1.postBlogIdValidation,
    posts_validation_1.postBlogIdExistValidation,
    blogs_validation_1.inputValidationMiddleware
];
exports.postsRouter = (0, express_1.Router)({});
exports.postsRouter.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sortBy = req.query.sortBy ? String(req.query.sortBy) : undefined;
        let sortDirection = req.query.sortDirection ? String(req.query.sortDirection) : undefined;
        let pageNumber = req.query.pageNumber ? Number(req.query.pageNumber) : undefined;
        let pageSize = req.query.pageSize ? Number(req.query.pageSize) : undefined;
        const posts = yield posts_query_repository_1.postsQueryRepository.getPosts(sortBy, sortDirection, pageNumber, pageSize);
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(posts);
    }
    catch (error) {
        console.error('Ошибка при получении данных из коллекции:', error);
        res.status(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
    }
}));
exports.postsRouter.get('/:id', posts_validation_1.postIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const post = yield posts_query_repository_1.postsQueryRepository.getPostById(req.params.id);
        if (!post) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
            return;
        }
        res.status(http_statuses_1.HTTP_STATUSES.OK_200).send(post);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
exports.postsRouter.post('/', ...exports.postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let getBlogName;
    const getBlog = yield blogs_query_repository_1.blogsQueryRepository.getBlogById(req.body.blogId);
    if (getBlog) {
        getBlogName = getBlog.name;
        let newPost = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: getBlogName,
            createdAt: new Date().toISOString()
        };
        try {
            const response = yield posts_service_1.postsService.createPost(newPost);
            if (response instanceof mongodb_1.ObjectId) {
                const createdPost = yield posts_query_repository_1.postsQueryRepository.getPostById(response);
                res.status(http_statuses_1.HTTP_STATUSES.CREATED_201).send(createdPost);
                return;
            }
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
        }
        catch (error) {
            res.sendStatus(http_statuses_1.HTTP_STATUSES.SERVER_ERROR_500);
        }
    }
}));
exports.postsRouter.put('/:id', ...exports.postValidators, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let postDataToUpdate = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId
    };
    try {
        const response = yield posts_service_1.postsService.updatePost(new mongodb_1.ObjectId(req.params.id), postDataToUpdate);
        res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
exports.postsRouter.delete('/:id', auth_validation_1.authorizationMiddleware, posts_validation_1.postIdValidation, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield posts_service_1.postsService.deletePost(new mongodb_1.ObjectId(req.params.id));
        res.sendStatus(response ? http_statuses_1.HTTP_STATUSES.NO_CONTENT_204 : http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
    catch (error) {
        res.sendStatus(http_statuses_1.HTTP_STATUSES.NOT_FOUND_404);
    }
}));
//# sourceMappingURL=posts-router.js.map