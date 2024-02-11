import {Router, Request, Response} from "express";
import {PostCreateType, PostViewType} from "../types/post-type";
import {authorizationMiddleware} from "../validation/auth-validation";
import {
    postBlogIdExistValidation,
    postBlogIdValidation,
    postContentValidation,
    postDescValidation,
    postIdValidation,
    postTitleValidation
} from "../validation/posts-validation";
import {inputValidationMiddleware} from "../validation/blogs-validation";
import {HTTP_STATUSES} from "../constants/http-statuses";
import {ObjectId} from "mongodb";
import {postsService} from "../domain/posts-service";
import {postsQueryRepository} from "../query-repositories/posts-query/posts-query-repository";
import {blogsRepositories} from "../repositories/blogs-repositories";
import {blogsQueryRepository} from "../query-repositories/blogs-query/blogs-query-repository";
import {BlogEntityType, BlogViewType} from "../types/blog-type";

export const postValidators = [
    authorizationMiddleware,
    postTitleValidation,
    postDescValidation,
    postContentValidation,
    postBlogIdValidation,
    postBlogIdExistValidation,
    inputValidationMiddleware
]

export const postsRouter = Router({})


postsRouter.get('/',
    async (req: Request, res: Response) => {
        try {

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
            if(req.query.pageNumber) {
                pageNumber = Number(req.query.pageNumber)
            }
            if(req.query.pageSize){
                pageSize = Number(req.query.pageSize)
            }



            const posts = await postsQueryRepository.getPosts(sortBy, sortDirection, pageNumber,pageSize)
            res.status(HTTP_STATUSES.OK_200).send(posts)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.status(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })


postsRouter.get('/:id',
    postIdValidation,
    async (req: Request, res: Response) => {
        try {
            const post = await postsQueryRepository.getPostById(req.params.id)
            if (!post) {
                res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
                return
            }

            res.status(HTTP_STATUSES.OK_200).send(post)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    }
)

postsRouter.post('/',
    ...postValidators,
    async (req: Request, res: Response) => {
        let getBlogName
      const getBlog:BlogViewType|boolean =  await blogsQueryRepository.getBlogById( req.body.blogId)
        if(getBlog){
            getBlogName = getBlog.name
        let newPost: PostCreateType = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
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

postsRouter.put('/:id',
    ...postValidators,
    async (req: Request, res: Response) => {
        let postDataToUpdate = {
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId
        }
        try {
            const response: boolean = await postsService.updatePost(new ObjectId(req.params.id), postDataToUpdate)
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })


postsRouter.delete('/:id',
    authorizationMiddleware,
    postIdValidation,
    async (req: Request, res: Response) => {
        try {
            const response: boolean = await postsService.deletePost(new ObjectId(req.params.id))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)
        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })