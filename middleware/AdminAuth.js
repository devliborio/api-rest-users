const jwt = require("jsonwebtoken");
const secret = require("../secret_jwt/secret")

module.exports = function (req, res, next) {
    const authToken = req.headers['authorization'];
    if (authToken != undefined) {

        const bearer = authToken.split(' ');
        let token = bearer[1];
        try {
            let decoded = jwt.verify(token, secret);
            if(decoded.role == 1){
                next();
            } else {
                res.status(401);
                res.send("Você não tem permissão para esta requisição!.");
                return;
            }
        } catch (err) {
            res.status(401);
            res.send("Você não está autenticado.");
            return;
        }
    } else {
        res.status(401);
        res.json({msg: "Voce não está autenticado"});
        return;
    }
}