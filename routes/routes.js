let express = require("express")
let app = express();
let router = express.Router();
let HomeController = require("../controllers/HomeController");


router.get('/', HomeController.index);

module.exports = router;