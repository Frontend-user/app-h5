export const blogsPaginate = {
    getPagination(pageNumber?: number, pageSize?: number) {

        const newPageNumber = pageNumber ?? 1
        const newPageSize = pageSize ?? 10
        const skip = (newPageNumber - 1) * newPageSize
        const limit = newPageSize

        return {skip, limit}
        // if (pageNumber) {
        //
        // }
        // if (!pageNumber && !pageSize) {
        //     pageNumber = 1
        //     pageSize = 10
        //     dataToReturn['skip'] = 0
        //     dataToReturn['limit'] = pageSize
        //     return dataToReturn
        // }
        // else if(!pageNumber && pageSize){
        //     const skip = (pageNumber * pageSize) - pageSize
        //     const limit = pageSize
        //     const dataToReturn: any = {}
        //     dataToReturn['skip'] = skip
        //     dataToReturn['limit'] = limit
        //     return dataToReturn
        // }e

    }

}