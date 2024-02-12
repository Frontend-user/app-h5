import {Request, Response, Router} from "express";
import {HTTP_STATUSES} from "../../constants/http-statuses";
import {blogsQueryRepository} from "../../[A01]blogs/blogs-query/blogs-query-repository";
import {BlogCreateType, BlogViewType} from "../../types/blog-type";
import {ObjectId} from "mongodb";
import {blogsService} from "../../[A01]blogs/domain/blogs-service";
import {
    usersEmailValidation,
    usersLoginValidation,
    usersPasswordValidation,

} from "../validation/users-validation";
import {blogIdValidation, inputValidationMiddleware} from "../../validation/blogs-validation";
import {UserCreateType, UserViewType} from "../types/user-types";
import {usersService} from "../domain/users-service";
import {usersRepositories} from "../repository/users-repository";
import {usersQueryRepository} from "../query-repository/users-query-repository";
import {authorizationMiddleware} from "../../validation/auth-validation";
import {blogsRouter} from "../../[A01]blogs/router/blogs-router";

const usersValidators = [
    authorizationMiddleware,
    usersLoginValidation,
    usersPasswordValidation,
    usersEmailValidation,
    inputValidationMiddleware,
]
export const usersRouter = Router({})


usersRouter.get('/',
    authorizationMiddleware,
    async (req: Request, res: Response) => {
    console.log(req.query,'FILTER QUERY!!!!!!!!!!!!!!!!!!!!!!')
        try {
            let searchLoginTerm = req.query.searchLoginTerm ? String(req.query.searchLoginTerm): undefined
            let searchEmailTerm = req.query.searchEmailTerm ? String(req.query.searchEmailTerm): undefined
            let sortBy = req.query.sortBy ? String(req.query.sortBy): undefined
            let sortDirection= req.query.sortDirection ? String(req.query.sortDirection): undefined
            let pageNumber = req.query.pageNumber ?  Number(req.query.pageNumber): undefined
            let pageSize = req.query.pageSize ?  Number(req.query.pageSize): undefined

            const blogs = await usersQueryRepository.getUsers(searchLoginTerm,searchEmailTerm, sortBy, sortDirection, pageNumber,pageSize)
            res.status(HTTP_STATUSES.OK_200).send(blogs)
        } catch (error) {
            console.error('Ошибка при получении данных из коллекции:', error);
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }
    })


usersRouter.post('/',
    ...usersValidators,
    async (req: Request, res: Response) => {
        try {
            const user: UserCreateType = {
                login: req.body.login,
                email: req.body.email,
                password: req.body.password,
                createdAt: new Date().toISOString(),
            }
            const response:  ObjectId | false = await usersService.createUser(user)
            if (response) {
                const createdBlog: UserViewType | false = await usersQueryRepository.getUserById(response)
                res.status(HTTP_STATUSES.CREATED_201).send(createdBlog)
                return
            }

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.SERVER_ERROR_500)
        }

    })


usersRouter.delete('/:id',
    authorizationMiddleware,
    blogIdValidation,
    async (req: Request, res: Response) => {
        try {
            const response: boolean = await usersService.deleteUser(new ObjectId(req.params.id))
            res.sendStatus(response ? HTTP_STATUSES.NO_CONTENT_204 : HTTP_STATUSES.NOT_FOUND_404)

        } catch (error) {
            res.sendStatus(HTTP_STATUSES.NOT_FOUND_404)
        }
    })

