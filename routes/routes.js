const express = require("express");
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UsersController");


router.get('/', HomeController.index);
router.get('/user', UserController.search);
router.get('/user/:id', UserController.searchById);
router.post('/user', UserController.create);
router.put('/user', UserController.edit);
router.delete('/user/:id', UserController.remove);
router.post("/recoverpassword", UserController.recoverPassword);
router.post("/changepassword", UserController.changePassword);
router.post("/login", UserController.login);

module.exports = router;