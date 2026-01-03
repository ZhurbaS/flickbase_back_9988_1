const express = require('express');
const router = express.Router();
const articlesController = require('../controllers/articles.controller');
const { addArticleValidator } = require('../middleware/validation');

// AUTH
const auth = require('../middleware/auth');

router.post(
  '/',
  auth('createAny', 'articles'),
  addArticleValidator,
  articlesController.createArticle
);

// ADMIN
router
  .route('/article/:id')
  .get(auth('readAny', 'articles'), articlesController.getArticleById)
  .patch(auth('updateAny', 'articles'), articlesController.updateArticleById)
  .delete(auth('deleteAny', 'articles'), articlesController.deleteArticleById);

// USERS
router.route('/users/article/:id').get(articlesController.getUserArticleById);

router
  .route('/all')
  .get(articlesController.getAllArticles)
  .post(articlesController.getMoreArticles);

router.post(
  '/admin/paginate',
  auth('readAny', 'articles'),
  articlesController.adminPaginate
);

// Categories
router
  .route('/categories')
  .post(auth('createAny', 'categories'), articlesController.createCategory)
  .get(auth('readAny', 'categories'), articlesController.getAllCategories);

module.exports = router;
