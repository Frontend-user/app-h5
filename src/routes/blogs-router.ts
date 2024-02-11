import {raw, Request, Response, Router} from "express";
import {
    blogDescValidation, blogIdValidation, blogNameValidation,
    blogWebUrlValidation, blogWebUrlValidation2, inputValidationMiddleware
} from "../validation/blogs-validation";
import {authorizationMiddleware} from "../validation/auth-validation";
import {BlogCreateType, BlogUpdateType, BlogViewType} from "../types/blog-type";
import {blogsRepositories} from "../repositories/blogs-repositories";
import {HTTP_STATUSES} from "../constants/http-statuses";

import {ObjectId} from "mongodb";
import {blogsService} from "../domain/blogs-service";
import {blogsQueryRepository} from "../query-repositories/blogs-query/blogs-query-repository";

const blogValidators = [
    authorizationMiddleware,
    blogDescValidation,
    blogNameValidation,
    blogWebUrlValidation,
    blogWebUrlValidation2,
    inputValidationMiddleware,
]
export const blogs: BlogViewType[] = []
export const blogsRouter = Router({})


blogsRouter.get('/',
    async (req: Request, res: Response) => {
        try {
            let searchNameTerm
            let sortBy
            let sortDirection
            let pageNumber
            let pageSize
            if (req.query.searchNameTerm) {
                searchNameTerm = String(req.query.searchNameTerm)
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


            const blogs = await blogsQueryRepository.getBlogs(searchNameTerm, sortBy, sortDirection, pageNumber,pageSize)
            res.status(HTTP_STATUSES.OK_200).send(blogs)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })

blogsRouter.get('/:id', blogIdValidation, async (req: Request, res: Response) => {
        const blog = await blogsQueryRepository.getBlogById(req.params.id)
        if (!blog) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
            return
        }

        res.status(HTTP_STATUSES.OK_200).send(blog)

    }
)


blogsRouter.post('/',
    ...blogValidators,
    async (req: Request, res: Response) => {
        try {
            const newBlog: BlogCreateType = {
                name: req.body.name,
                description: req.body.description,
                websiteUrl: req.body.websiteUrl,
                createdAt: new Date().toISOString(),
                isMembership: false
            }
            const response: ObjectId | false = await blogsService.createBlog(newBlog)
            if (response) {
                const createdBlog: BlogViewType | boolean = await blogsQueryRepository.getBlogById(response)
                res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
                return
            }

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    })



blogsRouter.put('/:id',
    ...blogValidators,
    async (req: Request, res: Response) => {
        let blogDataToUpdate: BlogUpdateType = {
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl,
        }

        try {
            const response: boolean = await blogsService.updateBlog(new ObjectId(req.params.id), blogDataToUpdate)
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })


blogsRouter.delete('/:id',
    authorizationMiddleware,
    blogIdValidation,
    async (req: Request, res: Response) => {
        try {
            const response: boolean = await blogsService.deleteBlog(new ObjectId(req.params.id))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })


