const express = require('express');
const router = express.Router();

const controllers = require('../controllers/users');
const checkAuth = require('../middleware/authentication');
//Fetching all User
router.get('/',checkAuth,controllers.get_all_users);

// Finding Specific users
router.get('/:userid',checkAuth, controllers.getUser);

//signing- up User
router.post('/signup', controllers.signup);

//Login user
router.post('/login',controllers.login);
//Edit User Details
router.patch('/:userid',checkAuth, controllers.updateUser);

//Deleting User
router.delete('/:userid',checkAuth, controllers.deleteUser);

// delete everything
router.delete('/',checkAuth, controllers.deleteAllUsers);

module.exports = router;
