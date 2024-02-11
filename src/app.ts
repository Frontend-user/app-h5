import express, {NextFunction, Request, Response, Router} from 'express'
import {runDb} from "./repositories/db";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {testRouter} from "./routes/test-router";
import {blogsPostsBindRouter} from "./routes/blogs-posts-bindings-router";

export const app = express()
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use('/blogs',blogsRouter)
app.use('/posts', postsRouter)
app.use('/testing',testRouter)
app.use('/blogs',blogsPostsBindRouter)
// MIDlawre expres для обработки ошибок

