import {blogsSorting} from "../../blogs/blogs-query/utils/blogs-sorting";
import {blogsPaginate} from "../../blogs/blogs-query/utils/blogs-paginate";
import {usersCollection} from "../../db";
import {UserEntityType, UserHashType, UserViewType} from "../types/user-types";
import {ObjectId} from "mongodb";
import {QueryFindType} from "../../blogs/blogs-query/types/query-types";
import {Pagination} from "../../common/types/pagination";

export const usersQueryRepository = {
    async getUsers(searchLoginTerm?: string, searchEmailTerm?: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number): Promise<Pagination<UserViewType[]>> {
        const findQuery = this.__getUsersFindings(searchLoginTerm, searchEmailTerm)
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)
        let users: UserHashType[] = await usersCollection.find(findQuery).sort(sortQuery).skip(skip).limit(limit).toArray();
        const allUsers = await usersCollection.find(findQuery).sort(sortQuery).toArray()
        let pagesCount = Math.ceil(allUsers.length / newPageSize)


        const fixArrayIds = users.map((user => this.__changeIdFormat(user)))

        return  {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allUsers.length,
            "items": fixArrayIds
        }
    },
    async getUserById(userId: ObjectId): Promise<UserViewType | false> {
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

    __getUsersFindings(searchLoginTerm?: string, searchEmailTerm?: string) {
        let findQuery: any = {}
        if (searchLoginTerm || searchEmailTerm) {
            findQuery = {
                $or: [{login: {$regex: searchLoginTerm, $options: 'i'}}, {
                    email: {
                        $regex: searchEmailTerm,
                        $options: 'i'
                    }
                }]
            };
        }
        return findQuery
    },

}