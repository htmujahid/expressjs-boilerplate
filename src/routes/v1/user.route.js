const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router
  .route('/')
  .post(auth('admin'), validate(userValidation.createUser), userController.createUser)
  .get(auth('admin'), validate(userValidation.getUsers), userController.getUsers);

router
  .route('/:userId')
  .get(auth('admin'), validate(userValidation.getUser), userController.getUser)
  .patch(auth('admin'), validate(userValidation.updateUser), userController.updateUser)
  .delete(auth('admin'), validate(userValidation.deleteUser), userController.deleteUser);

module.exports = router;
