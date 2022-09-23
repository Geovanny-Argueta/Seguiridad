const express = require('express');

// Controllers
const {
	getAllComments,
	createComment,
	updateComment,
	deleteComment,
} = require('../controllers/comments.controller');

// Middlewares
const { commentExists } = require('../middlewares/comments.middlewares');
const {protecSession, protectCommentsOwners} = require('../middlewares/auth.middleware')

const commentsRouter = express.Router();
//Protecting endPoints
commentsRouter.use(protecSession)

commentsRouter.post('/', createComment);

commentsRouter.get('/', getAllComments);

commentsRouter.patch('/:id', commentExists, protectCommentsOwners, updateComment);

commentsRouter.delete('/:id', commentExists, protectCommentsOwners, deleteComment);

module.exports = { commentsRouter };
