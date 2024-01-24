class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }
    // product search query 
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};

        // console.log(keyword);

        this.query = this.query.find({ ...keyword });
        return this;
    }
    // product filter query 
    filter() {
        const queryCopy = { ...this.queryStr }

        // console.log(queryCopy)

        // Removing some fields for category 

        // Why we should need remove? bcz When i call then i get something like that { keyword:"product name",category:"product category" } but i just need category that's why i remove keyword from filter query 

        const removeFields = ["keyword", "page", "limit"];

        removeFields.forEach(key => delete queryCopy[key])

        // console.log(queryCopy) 

        //  filter for price and ratting 

        let queryStr = JSON.stringify(queryCopy);

        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

        //   gt = gater then 
        // lt = less then  

        this.query = this.query.find(JSON.parse(queryStr));

        // console.log(queryStr);

        return this;


    }

    pagination(resultPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultPerPage * (currentPage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip);

        return this;
    }
}

module.exports = ApiFeatures;