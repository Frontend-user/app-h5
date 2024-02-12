"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const test_router_1 = require("./routes/test-router");
const blogs_posts_bindings_router_1 = require("./routes/blogs-posts-bindings-router");
const users_router_1 = require("./[A03]users/router/users-router");
const blogs_router_1 = require("./[A01]blogs/router/blogs-router");
const posts_router_1 = require("./[A02]posts/router/posts-router");
const auth_router_1 = require("./[A04]auth/auth-router/auth-router");
exports.app = (0, express_1.default)();
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/users', users_router_1.usersRouter);
exports.app.use('/auth', auth_router_1.authRouter);
exports.app.use('/testing', test_router_1.testRouter);
exports.app.use('/blogs', blogs_posts_bindings_router_1.blogsPostsBindRouter);
//# sourceMappingURL=app.js.map