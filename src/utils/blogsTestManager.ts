import request from "supertest";
import {app} from "../app";
import {BlogUpdateType, BlogViewType} from "../types/blog-type";
import {PostUpdateType, PostUpdateTypeForBind} from "../types/post-type";

export const blogsTestManager = {

    async createBlog(route: string, token: string, dataToCreateBlog: BlogUpdateType) {
        const responseCreateBlog = await request(app)
            .post(route)
            .set('Authorization', `${token}`)
            .send(dataToCreateBlog)

        return responseCreateBlog

    },
    async createPost(route: string,blogId:string, token: string, dataToCreateBlog: PostUpdateTypeForBind) {
        const responseCreateBlog = await request(app)
            .post(`/blogs/${blogId}/posts`)
            .set('Authorization', `${token}`)
            .send(dataToCreateBlog)

        return responseCreateBlog

    },
     arraySort<T>(arrayToSort:T[], sortBy: any, sortDirection: any) {
        return  arrayToSort.slice().sort((a: any, b: any) => {
            if (a[sortBy] < b[sortBy]) {
                return sortDirection === 'asc' ? 1 : -1
            } else if (a[sortBy] > b[sortBy]) {
                return sortDirection === 'asc' ? -1 : 1
            } else {
                return 0
            }
        });
    }

}