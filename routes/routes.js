let express = require("express");
let app = express();
let router = express.Router();
let HomeController = require("../controllers/HomeController");
let UserController = require("../controllers/UsersController");


router.get('/', HomeController.index);
router.post('/user', UserController.create);

module.exports = router;