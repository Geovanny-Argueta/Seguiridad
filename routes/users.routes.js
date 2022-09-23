const express = require("express");
const { body, validationResult } = require("express-validator");

// Controllers
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  login
} = require("../controllers/users.controller");

// Middlewares
const { userExists } = require("../middlewares/users.middlewares");
const {createUserValidators} = require("../middlewares/validators.middlewares");
const {
  protecSession, 
  protectUsersAccount,
  protectAdmin
} = require('../middlewares/auth.middleware')


const usersRouter = express.Router();

usersRouter.post("/", createUserValidators, createUser);
usersRouter.post("/login", login)

//Proytecting below endpoint
usersRouter.use(protecSession)
usersRouter.get("/", protectAdmin, getAllUsers);
usersRouter.patch("/:id", userExists, protectUsersAccount, updateUser);
usersRouter.delete("/:id", userExists, protectUsersAccount, deleteUser);

module.exports = { usersRouter };
