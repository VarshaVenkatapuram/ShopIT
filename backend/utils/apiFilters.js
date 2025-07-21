class APIFilter{
    constructor(query,queryStr)
    {
        this.query=query;
        this.queryStr=queryStr;
    }
    search() {
  const keyword = this.queryStr.keyword
    ? {
        name: {
          $regex: this.queryStr.keyword,
          $options: "i",
        },
      }
    : {};

  console.log("Search keyword filter:", JSON.stringify(keyword));

  this.query = this.query.find(keyword);
  return this;
}

filters() {
  const queryCopy = { ...this.queryStr };

  const fieldsToRemove = ["keyword","page"];
  fieldsToRemove.forEach((el) => delete queryCopy[el]);

  const mongoQuery = {};

  Object.keys(queryCopy).forEach((key) => {
    const value = queryCopy[key];

    // Match keys like "price[gte]"
    const match = key.match(/^(\w+)\[(gte|gt|lte|lt)\]$/);
    if (match) {
      const field = match[1];
      const operator = `$${match[2]}`;

      if (!mongoQuery[field]) {
        mongoQuery[field] = {};
      }

      mongoQuery[field][operator] = isNaN(value) ? value : Number(value);
    } else {
      // Regular fields
      mongoQuery[key] = isNaN(value) ? value : Number(value);
    }
  });

  console.log("=========");
  console.log(JSON.stringify(mongoQuery));

  this.query = this.query.find(mongoQuery);
  return this;
}

pagination(resPerPage)
{
    const currentPage=Number(this.queryStr.page)||1;
    const skip=resPerPage*(currentPage-1);
    
    this.query=this.query.limit(resPerPage).skip(skip);
    return this;
}

}
export default APIFilter;