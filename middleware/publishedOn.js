module.exports = {
  publishedOn: () => {
    const published = new Date();
    return published.toDateString();
    next();
  }
};
