const express = require("express");
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UsersController");
const AdminAuth = require("../middleware/AdminAuth")


router.get('/', HomeController.index);
router.get('/user', AdminAuth, UserController.search);
router.get('/user/:id', AdminAuth, UserController.searchById);
router.put('/user', AdminAuth, UserController.edit);
router.post('/user', UserController.create);
router.post("/recoverpassword", AdminAuth, UserController.recoverPassword);
router.post("/changepassword", AdminAuth, UserController.changePassword);
router.post("/login", UserController.login);
router.post("/validate", AdminAuth, UserController.validate);
router.delete('/user/:id', AdminAuth, UserController.remove);

module.exports = router;