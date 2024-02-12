import {ObjectId} from "mongodb";
import {BlogCreateType, BlogEntityType, BlogUpdateType, BlogViewType} from "../../types/blog-type";
import {blogsRepositories} from "../repository/blogs-repositories";


export const blogsService = {

    async createBlog(blog: BlogCreateType): Promise<false | ObjectId> {
        const newBlogId = await blogsRepositories.createBlog(blog)
        return newBlogId ? newBlogId : false
    },

    async updateBlog(id: ObjectId, updateBlog: BlogUpdateType): Promise<boolean> {
        return await blogsRepositories.updateBlog(id, updateBlog)
    },

    async deleteBlog(id: ObjectId): Promise<boolean> {
        return await blogsRepositories.deleteBlog(id)
    },

}