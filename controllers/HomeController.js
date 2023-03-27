class HomeController {

    async index(req, res) {
        res.send("APIrest Online!");
    }

}

module.exports = new HomeController();