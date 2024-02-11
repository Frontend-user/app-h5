"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogsPaginate = void 0;
exports.blogsPaginate = {
    getPagination(pageNumber, pageSize) {
        if (!pageNumber || !pageSize) {
            pageNumber = 1;
            pageSize = 10;
            const dataToReturn = {};
            dataToReturn['skip'] = 0;
            dataToReturn['limit'] = pageSize;
            return dataToReturn;
        }
        else {
            const skip = (pageNumber * pageSize) - pageSize;
            const limit = pageSize;
            const dataToReturn = {};
            dataToReturn['skip'] = skip;
            dataToReturn['limit'] = limit;
            return dataToReturn;
        }
    }
};
//# sourceMappingURL=blogs-paginate.js.map