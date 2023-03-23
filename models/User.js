const knex = require('../database/connection');
const bcrypt = require('bcrypt');

class User {

    async new(email, password, name) { // Método de criação de usuário
        try {
            let hash = await bcrypt.hash(password, 10); // Primeiro parâmetro a senha e quantas vezes vamos "hashear" ela.
            await knex.insert({ email, password: hash, name, role: 0 }).table('users');
        } catch (err) {
            console.log(err);
        }
    }

    async findEmail(email) { //  Método para validação de e-mail já existente

        try {

            let result = await knex.select('*').from('users').where({ email: email });

            if (result.length > 0) {
                return true
            } else {
                return false
            }

        } catch (err) {

            console.log(err);
            return false;

        }

    }


    async findAll() { // Sistema de busca de usuários

        try {
            let result = await knex.select(["id", "name", "email", "role"]).table("users");
            return result
        } catch (err) {
            console.log(err);
            return [];
        }

    }

    async findById(id) { // Sistema de busca de usuários por ID
        try {
            let result = await knex.select(["id", "name", "email", "role"]).where({ id: id }).table("users");
            if (result.length > 0) {
                return result[0];

            } else {
                return undefined;
            }

        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async findByEmail(email) { // Sistema de busca de usuários por ID
        try {
            let result = await knex.select(["id", "name", "email", "role"]).where({ email: email }).table("users");
            if (result.length > 0) {
                return result[0];

            } else {
                return undefined;
            }

        } catch (err) {
            console.log(err);
            return undefined;
        }
    }

    async update(id, name, email, role) { // Sistema de edição de usuários
        let user = await this.findById(id);

        if (user != undefined) {

            let editUser = {};

            if (email != undefined) {
                if (email != user.email) {
                    let result = await this.findEmail(email);
                    if (result == false) {
                        editUser.email = email;
                    } else {
                        return { status: false, msg: "O email já está cadastrado!" };
                    }
                }
            }


            if (name != undefined) {
                if (name < 4) {
                    return { status: false, msg: "O nome não pode conter menos que 4 caracteres!" };
                } else {
                    editUser.name = name;
                }
            }

            if (role != undefined) {
                editUser.role = role;
            }

            try {
                await knex.update(editUser).where({ id: id }).table("users");
                return { status: true };
            } catch (err) {
                return { status: false, msg: err };
            }


        } else {
            return { status: false, msg: "O usuário não existe!" }; // Uma forma de se comunicar com o controller!
        }
    }


    async delete(id) { // Sistema dee deleção de usuários
        let user = await this.findById(id)

        if (user != undefined) {
            try {
                await knex.delete().where({ id: id }).table("users");
                return { status: true }
            } catch (err) {
                return { status: false, msg: err };
            }
        } else {
            return { status: false, msg: "O usuário não existe, portanto não pode ser deletado." };
        }
    }
}

module.exports = new User();