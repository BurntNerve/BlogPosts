const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require('../app.js');

const should = chai.should();

chai.use(chaiHttp);

describe('Blog Posts', function() {
  it('should display posts on GET', function() {
    return chai.request(app).get('/blog-posts').then(function(res) {
      res.should.have.status(200);
      res.should.be.json;
      res.body.should.be.a('array');
      res.body.length.should.be.at.least(1);

      const expectedKeys = ['id', 'title', 'content', 'author', 'publishDate'];
      res.body.forEach(function(item) {
        item.should.be.a('object');
        item.should.include.keys(expectedKeys);
      });
    });
  });

  it('should create a post on POST', function() {
    const samplePost = {
      title: 'Testing Post',
      content: 'This is part of the testing suite',
      author: 'Me',
      publishDate: 'today'
    };

    return chai
      .request(app)
      .post('/blog-posts')
      .send(samplePost)
      .then(function(res) {
        res.should.have.status(201);
        res.should.be.json;
        res.body.should.be.a('object');

        const expectedKeys = [
          'id',
          'title',
          'content',
          'author',
          'publishDate'
        ];
        res.body.should.include.keys(expectedKeys);
        res.body.id.should.not.be.null;
        res.body.should.deep.equal(
          Object.assign(samplePost, { id: res.body.id })
        );
      });
  });

  it('should update a post on PUT', function() {
    const sampleUpdate = {
      title: 'updated post',
      content: 'updated content',
      author: 'Still me',
      publishDate: 'still today'
    };

    return chai.request(app).get('/blog-posts').then(function(res) {
      sampleUpdate.id = res.body[0].id;
      return chai
        .request(app)
        .put(`/blog-posts/${sampleUpdate.id}`)
        .send(sampleUpdate)
        .then(function(res) {
          res.should.have.status(204);
        });
    });
  });

  it('should delete a post on DELETE', function() {
    return chai.request(app).get('/blog-posts').then(function(res) {
      return chai
        .request(app)
        .delete(`/blog-posts/${res.body[0].id}`)
        .then(function(res) {
          res.should.have.status(204);
        });
    });
  });
});
