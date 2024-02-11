"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const blogs_router_1 = require("./routes/blogs-router");
const posts_router_1 = require("./routes/posts-router");
const test_router_1 = require("./routes/test-router");
const blogs_posts_bindings_router_1 = require("./routes/blogs-posts-bindings-router");
exports.app = (0, express_1.default)();
const jsonBodyMiddleware = express_1.default.json();
exports.app.use(jsonBodyMiddleware);
exports.app.use('/blogs', blogs_router_1.blogsRouter);
exports.app.use('/posts', posts_router_1.postsRouter);
exports.app.use('/testing', test_router_1.testRouter);
exports.app.use('/blogs', blogs_posts_bindings_router_1.blogsPostsBindRouter);
// MIDlawre expres для обработки ошибок
//# sourceMappingURL=app.js.map