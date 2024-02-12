import express, {NextFunction, Request, Response, Router} from 'express'
import {runDb} from "./repositories/db";
import {testRouter} from "./routes/test-router";
import {blogsPostsBindRouter} from "./routes/blogs-posts-bindings-router";
import {usersRouter} from "./[A03]users/router/users-router";
import {blogsRouter} from "./[A01]blogs/router/blogs-router";
import {postsRouter} from "./[A02]posts/router/posts-router";
import {authRouter} from "./[A04]auth/auth-router/auth-router";

export const app = express()
const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use('/blogs',blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter)
app.use('/auth', authRouter)
app.use('/testing',testRouter)
app.use('/blogs',blogsPostsBindRouter)

