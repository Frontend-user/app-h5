import {blogsCollection} from "../../repositories/db";
import {ObjectId, SortDirection} from "mongodb";
import {BlogEntityType, BlogViewType} from "../../types/blog-type";
import {blogsSorting} from "./utils/blogs-sorting";
import {blogsFinding} from "./utils/blogs-finding";
import {blogsPaginate} from "./utils/blogs-paginate";


export const blogsQueryRepository = {

    async getBlogs(searchNameTerm?: string, sortBy?: string, sortDirection?: string, pageNumber?: number, pageSize?: number) {
        const findQuery = blogsFinding.getFindings(searchNameTerm)
        const sortQuery = blogsSorting.getSorting(sortBy, sortDirection)
        const paginateQuery = blogsPaginate.getPagination(pageNumber, pageSize)
        //
        let blogs: BlogEntityType[] = await blogsCollection.find(findQuery).sort(sortQuery).skip(paginateQuery.skip).limit(paginateQuery.limit).toArray();
        // const allBlogs = await blogsCollection.find({name:{$regex: searchNameTerm, $options: 'i'}}).sort(sortQuery).toArray()
        const allBlogs = await blogsCollection.find(findQuery).sort(sortQuery).toArray()
        // console.log(allBlogs,'aalk')
        let pagesCount = 0


        if(!pageSize){
            pageSize = 10
        }

        if(!pageNumber){
            pageNumber = 1
        }
        pagesCount = Math.ceil(allBlogs.length / pageSize)


        const fixArrayIds = blogs.map((item => this.__changeIdFormat(item)))

        const response = {
            "pagesCount": pagesCount,
            "page": pageNumber,
            "pageSize": pageSize,
            "totalCount": allBlogs.length,
            "items": fixArrayIds
        }

        return response
    },

    async getBlogById(id: string | ObjectId): Promise<BlogViewType | false> {
        if (ObjectId.isValid(id) && typeof id === 'string' || id instanceof ObjectId) {
            const blog: BlogEntityType | null = await blogsCollection.findOne({_id: new ObjectId(id)})
            return blog ? this.__changeIdFormat(blog) : false
        }
        return false

    },

    __changeIdFormat(obj: any) {
        obj.id = obj._id
        delete obj._id
        return obj
    }

    //filter
    //types for presentation sloy
    //pagination sorting type for frontend
}