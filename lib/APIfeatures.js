class APIfeatures {
    constructor(query, queryString) {
        this.query = query
        this.queryString = queryString
    }

    sort() {
        const sortBy = this.queryString.sort || '-createdAt'
        this.query = this.query.sort(sortBy)
        return this
    }

    paginate() {
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit
        this.query = this.query.limit(limit).skip(skip)
        return this
    }

    search() {
        const search = this.queryString.search
        if (search) {
            this.query = this.query.find({
                $text: { $search: search }
            })
        } else {
            this.query = this.query.find()
        }
        return this
    }

    filter() {
        const queryObj = { ...this.queryString } // = req.query

        const excludedFields = ['page', 'sort', 'limit', 'search']
        excludedFields.forEach(ex => delete (queryObj[ex]))

        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)

        this.query.find(JSON.parse(queryStr))
        return this
    }
}

module.exports = APIfeatures