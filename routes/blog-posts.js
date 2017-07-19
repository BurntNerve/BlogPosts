const express = require('express');
const router = express.Router();
const { BlogPosts } = require('../models.js');
const { publishedOn } = require('../middleware/publishedOn.js');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

BlogPosts.create('My First Post', 'Hello World!', 'Sean Bray', publishedOn());

BlogPosts.create(
  'My Second Post',
  'I am getting good at this!',
  'Sean Bray',
  publishedOn()
);

router.get('/', (req, res) => {
  res.json(BlogPosts.get());
});

router.post('/', jsonParser, (req, res) => {
  const requiredFields = ['title', 'content', 'author', 'publishDate'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` from your request.`;
      console.error(message);
      res.status(400).send(message);
    }

    const newPost = BlogPosts.create(
      req.body.title,
      req.body.content,
      req.body.author,
      req.body.publishDate
    );
    res.json(newPost);
  }
});

router.put('/:id', jsonParser, (req, res) => {
  const requiredFields = ['id', 'title', 'content', 'author', 'publishDate'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` from your request.`;
      console.error(message);
      return res.status(400).send(message);
    }
  }

  if (req.params.id !== req.body.id) {
    const message = `Your ID's must match!`;
    console.error(message);
    return res.status(400).send(message);
  }

  const updatedItem = BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    publishDate: req.body.publishDate
  });
  res.status(204).end();
});

router.delete('/:id', jsonParser, (req, res) => {
  BlogPosts.delete(req.params.id);
  res.status(204).end();
});

module.exports = router;
