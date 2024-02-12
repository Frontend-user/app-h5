import {PostEntityType, PostViewType} from "../../common/types/post-type";
import {postsCollection} from "../../db";
import {ObjectId} from "mongodb";
import {blogsSorting} from "../../blogs/blogs-query/utils/blogs-sorting";
import {blogsPaginate} from "../../blogs/blogs-query/utils/blogs-paginate";
import {Pagination} from "../../common/types/pagination";

export const postsQueryRepository = {
    async getPosts(sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number): Promise<Pagination<PostViewType[]>> {
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)


        let posts: PostEntityType[] = await postsCollection.find({}).sort(sortQuery).skip(skip).limit(limit).toArray();
        const allPosts = await postsCollection.find({}).sort(sortQuery).toArray()
        let pagesCount = Math.ceil(allPosts.length / newPageSize)
        const fixArrayIds = posts.map((item => this.__changeIdFormat(item)))

        return {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allPosts.length,
            "items": fixArrayIds
        }
    },
    async getPostsByBlogId(blogId?: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number):Promise<Pagination<PostViewType[]>>  {
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const {skip, limit, newPageNumber, newPageSize} = blogsPaginate.getPagination(pageNumber, pageSize)

        let posts: PostEntityType[] = await postsCollection.find({"blogId": blogId}).sort(sortQuery).skip(skip).limit(limit).toArray();
        const allPosts = await postsCollection.find({"blogId": blogId}).toArray()
        let pagesCount = Math.ceil(allPosts.length / newPageSize)

        const fixArrayIds = posts.map((item => this.__changeIdFormat(item)))

        return {
            "pagesCount": pagesCount,
            "page": newPageNumber,
            "pageSize": newPageSize,
            "totalCount": allPosts.length,
            "items": fixArrayIds
        }
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
