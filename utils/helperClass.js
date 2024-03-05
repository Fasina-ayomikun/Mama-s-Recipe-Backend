class helperClass {
  constructor(base, query) {
    (this.base = base), (this.query = query);
  }
  search() {
    const search = this.query.search
      ? {
          name: {
            $regex: this.query.search,
            $options: "i",
          },
        }
      : {};
    this.base = this.base.find({ ...search });

    return this;
  }
  filter() {
    const {
      equipment,
      ingredient,
      minLikes,
      minAvgRating,
      creator,
      minReviews,
    } = this.query;
    const filterQuery = {};
    if (equipment) {
      filterQuery.equipments = { $in: [equipment] };
    }
    if (ingredient) {
      filterQuery.ingredients = { $in: [ingredient] };
    }
    if (minLikes) {
      filterQuery.noOfLikes = { $gte: minLikes };
    }
    if (minAvgRating) {
      filterQuery.averageRatings = { $gte: minAvgRating };
    }
    if (minReviews) {
      filterQuery.noOfReviews = { $gte: minReviews };
    }
    if (creator) {
      filterQuery.user = creator;
    }
    this.base = this.base.find(filterQuery);
    return this;
  }

  getLimitedResult(resultPerPage) {
    let { page } = this.query;
    if (!page) {
      page = 1;
    }
    const skipValue = (page - 1) * resultPerPage;
    this.base = this.base.limit(resultPerPage).skip(skipValue);
    return this;
  }
}
module.exports = helperClass;
