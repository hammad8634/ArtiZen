const express = require('express');
const buyerauthController = require('../controllers/buyer/buyerauthController');
const ChatController = require('../controllers/chat/chatController');
const sellerauthController = require('../controllers/seller/sellerauthController');

const router = express.Router();

router
  .route('/createseller')
  .post(sellerauthController.protect, ChatController.createChat);

router
  .route('/createbuyer')
  .post(buyerauthController.protect, ChatController.createChat);

router
  .route('/getchatseller')
  .get(sellerauthController.protect, ChatController.getChats);

router
  .route('/getchatbuyer')
  .get(buyerauthController.protect, ChatController.getChats);

// router
//   .route('/addmessageaccmanager/:id')
//   .post(
//     buyerauthController.protect,
//     buyerauthController.restrictTo('Account'),
//     ChatController.addMessage
//   );

// router
//   .route('/addmessageclient/:id')
//   .post(sellerauthController.protect, ChatController.addMessage);

router.get(
  '/sellerchatbyid/:id',
  sellerauthController.protect,
  ChatController.sellerSeen,
  ChatController.getChatbyId
);
router.get(
  '/buyerchatbyid/:id',
  buyerauthController.protect,
  ChatController.buyerSeen,
  ChatController.getChatbyId
);

module.exports = router;
