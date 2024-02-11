import {Request, Response, Router} from "express";
import {PostCreateType, PostViewType} from "../types/post-type";
import {postsService} from "../domain/posts-service";
import {ObjectId} from "mongodb";
import {postsQueryRepository} from "../query-repositories/posts-query/posts-query-repository";
import {HTTP_STATUSES} from "../constants/http-statuses";
import {postValidators} from "./posts-router";
import {authorizationMiddleware} from "../validation/auth-validation";
import {
    postBlogIdExistValidation,
    postBlogIdValidation,
    postContentValidation,
    postDescValidation,
    postTitleValidation
} from "../validation/posts-validation";
import {inputValidationMiddleware} from "../validation/blogs-validation";
import {
    blogsPostsBindingInputValidationMiddleware,
    postBlogBindIdExistValidation, postBlogsBindingBlogIdValidation,
} from "../validation/blogs-posts-bind-validation";
import {BlogViewType} from "../types/blog-type";
import {blogsQueryRepository} from "../query-repositories/blogs-query/blogs-query-repository";

export const blogsPostsBindRouter = Router({})
export const blogsPostBindValidators = [
    authorizationMiddleware,
    postTitleValidation,
    postDescValidation,
    postContentValidation,
    // postBlogsBindingBlogIdValidation,
    postBlogBindIdExistValidation,
    blogsPostsBindingInputValidationMiddleware
]
blogsPostsBindRouter.get('/:blogId/posts',
    postBlogBindIdExistValidation,
    blogsPostsBindingInputValidationMiddleware,
    async (req: Request, res: Response) => {
        let searchNameTerm
        let sortBy
        let sortDirection
        let pageNumber
        let pageSize
        if (req.query.SearchNameTerm) {
            searchNameTerm = String(req.query.SearchNameTerm)
        }
        if (req.query.sortBy) {
            sortBy = String(req.query.sortBy)
        }

        if (req.query.sortDirection) {
            sortDirection = String(req.query.sortDirection)
        }
        if (req.query.pageNumber) {
            pageNumber = Number(req.query.pageNumber)
        }
        if (req.query.pageSize) {
            pageSize = Number(req.query.pageSize)
        }

        try {
            const posts = await postsQueryRepository.getPostsByBlogId(String(req.params.blogId), sortBy, sortDirection, pageNumber,pageSize)
            res.send(posts)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })


blogsPostsBindRouter.post('/:blogId/posts',
    ...blogsPostBindValidators,
    async (req: Request, res: Response) => {
        let getBlogName
        const getBlog:BlogViewType|boolean =  await blogsQueryRepository.getBlogById( req.params.blogId)
        if(getBlog){
            getBlogName = getBlog.name
        console.log(req.params.blogId, 'params')
        let newPost: PostCreateType = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.params.blogId,
            blogName: getBlogName,
            createdAt: new Date().toISOString()
        }

        try {
            const response = await postsService.createPost(newPost)
            if (response instanceof ObjectId) {
                const createdPost: PostViewType | boolean = await postsQueryRepository.getPostById(response)
                res.status(HTTP_STATUSES.CREATED_201).send(createdPost)
                return
            }
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
        }
    })