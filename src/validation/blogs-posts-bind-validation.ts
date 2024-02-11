import {body, param, validationResult} from "express-validator";
import {BlogViewType} from "../types/blog-type";
import {blogsQueryRepository} from "../query-repositories/blogs-query/blogs-query-repository";
import {ObjectId} from "mongodb";
import {NextFunction, Request, Response} from "express";
import {ErrorType} from "../types/error-type";

export const postBlogsBindingBlogIdValidation = param('id').trim().isLength({min: 1, max: 300}).withMessage({
    message: 'id is wrong',
    field: 'id'
})

export const postBlogBindIdExistValidation = param('blogId').custom(async (value, {req}) => {
    console.log(value,'value')
    const isExistBlogId: BlogViewType | boolean = await blogsQueryRepository.getBlogById(value)
    console.log(isExistBlogId,'isExistBlogId')

    if (isExistBlogId) {
        return true
    } else {
        throw new Error('Wrong blogId');
    }
}).withMessage({
    message: 'Wrong blogId',
    field: 'blogId'
})

export const blogsPostsBindingInputValidationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({onlyFirstError:true})
    if (errors.length) {
        let errorsForClient:ErrorType[] = []
        console.log(errors,'errors')
        for (const error of errors) {
            errorsForClient.push(error.msg)
            console.log(error,'error.msg.name')
            if(error.msg.field=== 'blogId'){
                res.sendStatus(404)
                return;
            }
        }

        res.status(400).json({errorsMessages: errorsForClient})
        return
    } else {
        next()
    }
}
