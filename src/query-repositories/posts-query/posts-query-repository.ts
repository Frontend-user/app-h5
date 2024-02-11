import {PostEntityType, PostViewType} from "../../types/post-type";
import {blogsCollection, postsCollection} from "../../repositories/db";
import {ObjectId} from "mongodb";
import {blogsFinding} from "../blogs-query/utils/blogs-finding";
import {blogsSorting} from "../blogs-query/utils/blogs-sorting";
import {blogsPaginate} from "../blogs-query/utils/blogs-paginate";
import {BlogEntityType} from "../../types/blog-type";

export const postsQueryRepository = {
    async getPosts(sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number) {
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const paginateQuery = blogsPaginate.getPagination(pageNumber, pageSize)


        let posts: PostEntityType[] = await postsCollection.find({}).sort(sortQuery).skip(paginateQuery.skip).limit(paginateQuery.limit).toArray();
        const allPosts = await postsCollection.find({}).sort(sortQuery).toArray()
        let pagesCount = 0

        if(!pageSize){
            pageSize = 10
        }

        if(!pageNumber){
            pageNumber = 1
        }
        pagesCount = Math.ceil(allPosts.length / pageSize)
        const fixArrayIds = posts.map((item => this.__changeIdFormat(item)))

        const response = {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": allPosts.length,
            "items": fixArrayIds
        }

        return response
        // const posts:PostEntityType[] = await postsCollection.find({}).toArray();
        // const fixArrayIds:PostViewType[] = posts.map((item => this.__changeIdFormat(item)))
        // return fixArrayIds.length > 0 ? fixArrayIds:  []
    },
    async getPostsByBlogId(blogId?: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number) {
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const paginateQuery = blogsPaginate.getPagination(pageNumber, pageSize)

        let posts: PostEntityType[] = await postsCollection.find({"blogId": blogId}).sort(sortQuery).skip(paginateQuery.skip).limit(paginateQuery.limit).toArray();
        const allPosts = await postsCollection.find({"blogId": blogId}).toArray()
        let pagesCount = 0

        if(!pageSize){
            pageSize = 10
        }

        if(!pageNumber){
            pageNumber = 1
        }
            pagesCount = Math.ceil(allPosts.length / pageSize)

        const fixArrayIds = posts.map((item => this.__changeIdFormat(item)))

        const response = {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": allPosts.length,
            "items": fixArrayIds
        }

        return response
    },

    async getPostById(id: string | ObjectId): Promise<PostViewType | boolean> {
        const post: PostEntityType | null = await postsCollection.findOne({_id: new ObjectId(id)})
        return post ? this.__changeIdFormat(post) : false
    },


    __changeIdFormat(obj: any) {
        obj.id = obj._id
        delete obj._id
        return obj
    }

}
