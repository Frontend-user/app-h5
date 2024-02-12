"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsTestManager = void 0;
const supertest_1 = __importDefault(require("supertest"));
const app_1 = require("../app");
exports.blogsTestManager = {
    createBlog(route, token, dataToCreateBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseCreateBlog = yield (0, supertest_1.default)(app_1.app)
                .post(route)
                .set('Authorization', `${token}`)
                .send(dataToCreateBlog);
            return responseCreateBlog;
        });
    },
    createPost(route, blogId, token, dataToCreateBlog) {
        return __awaiter(this, void 0, void 0, function* () {
            const responseCreateBlog = yield (0, supertest_1.default)(app_1.app)
                .post(`/blogs/${blogId}/posts`)
                .set('Authorization', `${token}`)
                .send(dataToCreateBlog);
            return responseCreateBlog;
        });
    },
    arraySort(arrayToSort, sortBy, sortDirection) {
        return arrayToSort.slice().sort((a, b) => {
            if (a[sortBy] < b[sortBy]) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            else if (a[sortBy] > b[sortBy]) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            else {
                return 0;
            }
        });
    }
};
//# sourceMappingURL=blogsTestManager.js.map