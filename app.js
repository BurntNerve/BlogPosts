const express = require('express');
const app = express();
const logger = require('morgan');
const { BlogPosts } = require('./models.js');
const { publishedOn } = require('./middleware/publishedOn.js');

const blogPost = require('./routes/blog-posts.js');

app.use(logger('dev'));

app.get('/', (req, res) => {
  res.send('root directory');
});

app.use('/blog-posts', blogPost);

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
