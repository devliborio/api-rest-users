const User = require("../models/User");
const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secret = require("../secret_jwt/secret")

class UsersController {

    async search(req, res) {
        let users = await User.findAll();
        res.json(users)
    }

    async searchById(req, res) {
        let id = req.params.id;
        id = Number(id);
        let usersById = await User.findById(id);

        if (usersById == undefined) {
            res.status(404);
            res.json({ msg: "Usuário não encontrado!" });
            return;

        } else if (!id) {
            res.status(404)
            res.json({ msg: "Usuário não encontrado!" });
            return;
        } else {
            res.json(usersById);
            return;
        }
    }

    async create(req, res) {
        let { email, name, password, role} = req.body;
        let emailError;
        let nameError;
        let passwordError;
        let roleError;

        if (email == undefined || email == "" || email == " ") {
            emailError = "E-mail invalido ou indefinido!";
            res.status(400);
            res.json({ msg: emailError });
            return; // Importante trabalhando com controllers
        }

        if (name == undefined || name == "" || name == " ") {
            nameError = "Nome invalido ou indefinido!";
            res.status(400);
            res.json({ msg: nameError });
            return;
        }

        if (name.length < 4) {
            nameError = "Nome não pode conter menos que 4 caracteres!";
            res.status(400);
            res.json({ msg: nameError });
            return;
        }

        if (password == undefined || password == "" || password == " ") {
            passwordError = "Senha invalida ou indefinida!";
            res.status(400);
            res.json({ msg: passwordError });
            return;
        }

        if (password.length < 5) {
            passwordError = "Senha não pode conter menos de 5 caracteres!"
            res.status(400);
            res.json({ msg: passwordError });
            return;
        }

        if(role > 1){
            roleError = "O cargo só pode ser 1 ou 0"
            res.status(400);
            res.json({ msg: roleError });
            return;
        }

        if(role == undefined){
            roleError = "Cargo invalido ou vazio."
            res.status(400);
            res.json({ msg: roleError });
            return;
        }

        let emailExists = await User.findEmail(email); // true or false 

        if (emailExists) {
            res.status(406)
            res.json({ msg: "O email já está cadastrado!" })
            return;
        }

        await User.new(email, password, name, role);

        res.send("Dados recebidos com sucesso!");
    }

    async edit(req, res) {
        let { id, name, email, role } = req.body;
        let result = await User.update(id, name, email, role);
        if (result != undefined) {
            if (result.status) {
                res.status(200);
                res.send("Edição realizada com sucesso!");
                return;
            } else {
                res.status(406)
                res.send(result.msg)
                return;
            }
        } else {
            res.status(406);
            res.send("Ocorreu um erro no servidor!");
            return;
        }
    }

    async remove(req, res) {
        let id = req.params.id;

        let result = await User.delete(id);

        if (result.status) {
            res.status(200);
            res.send("Exclusão realizada com sucesso!");
            return;
        } else {
            res.status(406);
            res.send(result.msg);
            return;
        }
    }

    async login(req, res) {
        var { email, password } = req.body;
        let user = await User.findByEmail(email)

        if (user != undefined) {
            let result = await bcrypt.compare(password, user.password);
            if (result) {
                let token = jwt.sign({ email: user.email, role: user.role }, secret);
                res.status(200);
                res.json({ token: token });

            } else {
                res.status(400)
                res.json({ err: "A senha está incorreta!" })
            }
        } else {
            res.status(404);
            res.json({ err: "Usuário não encontrado!" });
        }
    }

    async recoverPassword(req, res) {
        let email = req.body.email;
        let user = await User.findByEmail(email);
        console.log(user);
        if (user != undefined) {
            let result = await PasswordToken.create(user)
            if (result.status) {
                res.status(200);
                res.send("" + result.token);
            } else {
                res.status(406)
                res.send(result.err);
            }
        } else {
            res.status(404)
            res.send("O email não existe no banco de dados!");
        }
    }

    async changePassword(req, res) {
        let token = req.body.token;
        let password = req.body.password;
        let isTokenValid = await PasswordToken.validate(token);

        if (isTokenValid.status) {
            await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token)
            res.status(200)
            res.send("Senha alterada com sucesso!");
        } else {
            res.status(406)
            res.send("Token inválido!");
        }
    }
}

module.exports = new UsersController();