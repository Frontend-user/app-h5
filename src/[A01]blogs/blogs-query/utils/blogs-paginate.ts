export const blogsPaginate = {
    getPagination(pageNumber?: number, pageSize?: number) {
        if (!pageNumber || !pageSize) {
            pageNumber = 1
            pageSize =  10
            const dataToReturn: any = {}
            dataToReturn['skip'] = 0
            dataToReturn['limit'] = pageSize
            return dataToReturn
        }else{
            const skip = (pageNumber * pageSize) - pageSize
            const limit = pageSize
            const dataToReturn: any = {}
            dataToReturn['skip'] = skip
            dataToReturn['limit'] = limit
            return dataToReturn
        }

    }

}