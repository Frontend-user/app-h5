import {blogsSorting} from "../../[A01]blogs/blogs-query/utils/blogs-sorting";
import {blogsPaginate} from "../../[A01]blogs/blogs-query/utils/blogs-paginate";
import {usersCollection} from "../../repositories/db";
import {UserEntityType, UserHashType, UserViewType} from "../types/user-types";
import {ObjectId} from "mongodb";
import {QueryFindType} from "../../[A01]blogs/blogs-query/models/query-types";

export const usersQueryRepository = {
    async getUsers(searchLoginTerm?: string, searchEmailTerm?: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number) {
        const findQuery = this.__getUsersFindings(searchLoginTerm,searchEmailTerm)
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const paginateQuery = blogsPaginate.getPagination(pageNumber, pageSize)
        let users: UserHashType[] = await usersCollection.find(findQuery).sort(sortQuery).skip(paginateQuery.skip).limit(paginateQuery.limit).toArray();
        const allUsers = await usersCollection.find(findQuery).sort(sortQuery).toArray()
        let pagesCount = 0


        if (!pageSize) {
            pageSize = 10
        }

        if (!pageNumber) {
            pageNumber = 1
        }
        pagesCount = Math.ceil(allUsers.length / pageSize)


        const fixArrayIds = users.map((user => this.__changeIdFormat(user)))
        // type ResponseType = {
        //     "pagesCount": ,
        //     "page": pageNumber,
        //     "pageSize": pageSize,
        //     "totalCount": allUsers.length,
        //     "items": fixArrayIds
        // }
        const response = {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": allUsers.length,
            "items": fixArrayIds
        }

        return response
    },
    async getUserById (userId:ObjectId ):Promise<UserViewType | false>{
        const getUser = await usersCollection.findOne({_id: userId})
        return getUser ? this.__changeIdFormat(getUser) : false
    },

    __changeIdFormat(obj: any) {
        obj.id = obj._id
        delete obj._id
        delete obj.passwordSalt
        delete obj.passwordHash
        return obj
    },

    __getUsersFindings(searchLoginTerm?:string, searchEmailTerm?:string){
        let findQuery: any = {}
        if (searchLoginTerm || searchEmailTerm) {
            findQuery =  { $or: [  {login:  {$regex: searchLoginTerm , $options: 'i'}}, {email:  {$regex: searchEmailTerm, $options: 'i'}}]};
        }
        return findQuery
    },

}