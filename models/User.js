const knex = require('../database/connection');
const bcrypt = require('bcrypt');

class User {

    async new(email, password, name) {
        try {
            let hash = await bcrypt.hash(password, 10); // Primeiro parâmetro a senha e quantas vezes vamos "hashear" ela.
            await knex.insert({ email, password: hash, name, role: 0 }).table('users')
        } catch (err) {
            console.log(err)
        }
    }
}

module.exports = new User()