const express = require('express');
const app = express();
const handleBlogPosts = require('./routes/blog-posts.js');
const { BlogPosts } = require('./models.js');
const morgan = require('morgan');

app.use(morgan('dev'));

BlogPosts.create('face', 'leg', 'nine', new Date());
BlogPosts.create('Second', 'Post Stuff', 'Sean Bray', new Date());

app.use('/blog-posts', handleBlogPosts);

app.use('/', (req, res) => {
  console.log('root directory!');
  res.status(200).send('Root!');
});

let server;

function runServer() {
  const port = process.env.PORT || 8080;
  return new Promise((resolve, reject) => {
    server = app
      .listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
        resolve(server);
      })
      .on('error', err => {
        reject(err);
      });
  });
}

function closeServer() {
  return new Promise((resolve, reject) => {
    console.log('Closing server');
    server.close(err => {
      if (err) {
        reject(err);
        // so we don't also call `resolve()`
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.log(err));
}

module.exports = { app, runServer, closeServer };
