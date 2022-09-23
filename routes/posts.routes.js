const express = require('express');

// Controllers
const {
	getAllPosts,
	createPost,
	updatePost,
	deletePost,
} = require('../controllers/posts.controller');

// Middlewares
const { postExists } = require('../middlewares/posts.middlewares');
const {createPostValidators,} = require('../middlewares/validators.middlewares');
const {protecSession, protectPostsOwners} = require('../middlewares/auth.middleware')

const postsRouter = express.Router();
//Protecting endpoint
postsRouter.use(protecSession)
postsRouter.post('/', createPostValidators, createPost);
postsRouter.get('/', getAllPosts);
postsRouter.patch('/:id', postExists, protectPostsOwners, updatePost);
postsRouter.delete('/:id', postExists, protectPostsOwners, deletePost);

module.exports = { postsRouter };
