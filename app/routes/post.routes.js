// app/routes/post.routes.js

module.exports = (app) => {
    const posts = require('../controllers/post.controller.js');
  
    const router = require('express').Router();
  
    // GET /posts
    router.get('/', posts.findAll);
  
    // Nếu sau này muốn thêm CRUD, có thể:
    // router.post('/', posts.create);
    // router.get('/:id', posts.findOne);
    // router.put('/:id', posts.update);
    // router.delete('/:id', posts.delete);
  
    app.use('/posts', router);
  };
  