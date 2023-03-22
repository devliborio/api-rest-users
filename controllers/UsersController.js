const User = require("../models/User");
class UsersController {

    async create(req, res) {
        let { email, name, password } = req.body;
        let emailError;
        let nameError;
        let passwordError;

        if (email == undefined || email == "") {
            emailError = "E-mail invalido ou indefinido!"
            res.json({ err: emailError });
            return; // Importante trabalhando com controllers
        }

        if (name == undefined || name == "") {
            nameError = "Nome invalido ou indefinido!"
            res.json({ err: nameError });
            return;
        }

        if (name.length < 4) {
            nameError = "Nome não pode conter menos que 4 caracteres!"
            res.json({ err: nameError });
            return;
        }

        if (password == undefined || password == "") {
            passwordError = "Senha invalida ou indefinida!"
            res.json({ err: passwordError });
            return;
        }

        if (password.length < 5) {
            passwordError = "Senha não pode conter menos de 5 caracteres!"
            res.json({ err: passwordError });
            return;
        }

        let emailExists =  await User.findEmail(email);

        if(emailExists){
            res.status(406)
            res.json({err: "O email já está cadastrado!"})
            return;
        }

        await User.new(email, password, name);

        res.send("Dados recebidos com sucesso!");
    }
}

module.exports = new UsersController();