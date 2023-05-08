const express = require('express');
const reviewController = require('../controllers/review/reviewController');
const buyerauthController = require('../controllers/buyer/buyerauthController');

const router = express.Router({ mergeParams: true });

router.route('/').get(reviewController.getAllReviews);

router.use(buyerauthController.protect);

router
  .route('/create/:id')
  .post(reviewController.setProductUser, reviewController.createReview);


router
  .route('/:id')
  .get(reviewController.getReview)
  .delete(reviewController.deleteReview)
  .patch(reviewController.updateReview);

module.exports = router;
