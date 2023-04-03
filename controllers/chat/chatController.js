const Chat = require('../../models/chatModel');
const factory = require('../factoryHandler');
const catchAsync = require('../../utils/catchAsync');
const AppError = require('../../utils/appError');

exports.createChat = catchAsync(async (req, res, next) => {
  if (req.user.role === 'Seller') {
    console.log('hii');
    const chat = await Chat.find({
      $and: [
        { seller: { $eq: req.user.id } },
        { buyer: { $eq: req.body.buyer } },
      ],
    });

    if (chat.length > 0) return next(new AppError('Chat Already Exist!', 400));

    const messages = [
      {
        message: req.body.message,
        name: req.user.name,
        senderId: req.user.id,
      },
    ];

    req.body.seller = req.user.id;
    req.body.sellerisSeen = true;
    req.body.messages = messages;
  }

  if (req.user.role === 'Buyer') {
    const chat = await Chat.find({
      $and: [
        { seller: { $eq: `${req.body.seller}` } },
        { buyer: { $eq: `${req.user.id}` } },
      ],
    });

    if (chat.length > 0) return next(new AppError('Chat Already Exist!', 400));

    const messages = [
      {
        message: req.body.message,
        name: req.user.name,
        senderId: req.user.id,
      },
    ];

    req.body.buyerisSeen = true;
    req.body.buyer = req.user.id;
    req.body.messages = messages;
  }

  const chatcreate = await Chat.create(req.body);

  res.status(201).json({
    status: 'Success',
    message: 'Chat Created',
    data: chatcreate,
  });
});

exports.getChats = catchAsync(async (req, res, next) => {
  let chat = [];

  if (req.user.role === 'Seller') {
    chat = await Chat.find({
      $and: [{ seller: { $eq: req.user.id } }],
    });
  }
  if (req.user.role === 'Buyer') {
    chat = await Chat.find({ buyer: { $eq: req.user.id } });
  }

  if (!chat) return next(new AppError('No chat found', 404));

  res.status(200).json({
    status: 'success',
    data: chat,
  });
});

// exports.addMessage = async (req, res) => {
//   try {
//     const chat = await Chat.findById(req.params.id);
//     if (!chat) {
//       return res.status(404).json({ message: 'Chat not found' });
//     }

//     if (req.user.role === 'Account') {
//       chat.clientisSeen = false;
//     }

//     if (req.user.role === 'Client') {
//       chat.managerisSeen = false;
//     }

//     const messagess = [
//       {
//         message: req.body.message,
//         name: req.user.name,
//       },
//     ];

//     const chat2 = await Chat.updateOne(
//       { _id: req.params.id },
//       { $push: { messages: messagess } }
//     );
//     await chat.save();
//     const chat3 = await Chat.findById(req.params.id);

//     // chat.messages = messagess;
//     // await chat.save();
//     res.json({ data: chat3 });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.sellerSeen = catchAsync(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  chat.sellerisSeen = true;
  chat.save();

  next();
});

exports.buyerSeen = catchAsync(async (req, res, next) => {
  const chat = await Chat.findById(req.params.id);

  chat.buyerisSeen = true;
  chat.save();

  next();
});

const getOne = (Model, popOpt, popOpt2, popOpt3) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    if (popOpt) {
      query = query.populate(popOpt);
    }

    const doc = await query;
    // const doc = await Model.findById(req.params.id).populate('reviews');

    if (!doc) {
      // return res.status(404).json('id not found');
      return next(new AppError('No doc found with such id'));
    }

    res.status(200).json({
      status: 'success',
      ManagerSeen: doc.managerisSeen,
      ClientSeen: doc.clientisSeen,
      data: doc.messages,
    });
  });

exports.getChatbyId = getOne(Chat);
