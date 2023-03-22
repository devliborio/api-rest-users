const knex = require('../database/connection');
const bcrypt = require('bcrypt');

class User {

    async new(email, password, name) {
        try {
            let hash = await bcrypt.hash(password, 10); // Primeiro parâmetro a senha e quantas vezes vamos "hashear" ela.
            await knex.insert({ email, password: hash, name, role: 0 }).table('users');
        } catch (err) {
            console.log(err);
        }
    }

    async findEmail(email) {

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
            let result = await knex.select("id", "name", "email", "role").where({ id: id }).table("users");
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
}

module.exports = new User();