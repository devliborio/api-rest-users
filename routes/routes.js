const express = require("express");
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UsersController");


router.get('/', HomeController.index);
router.get('/user', UserController.search);
router.get('/users/:id', UserController.searchById);
router.post('/user', UserController.create);

module.exports = router;