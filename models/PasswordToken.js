let knex = require("../database/connection");
let User = require("./User")

class PasswordToken {
    async create(user) {
        try {
            var token = Date.now()
            await knex.insert({ user_id: user.id, used: 0, token: token }).table('passwordtokens');
            return { status: true, token: token }
        } catch (err) {
            console.log(err);
            return { status: false, err: err }
        }
    }

    async validate(token) { // Método para verificar se esse token existe e se já foi usado em algum momento.
        try {
            let result = await knex.select().where({ token: token }).table("passwordtokens");
            if (result.length > 0) {
                let tk = result[0]
                if (tk.used) {
                    return { status: false } // 0
                } else {
                    return { status: true, token: tk }; // 1 
                }
            } else {
                return { status: false }
            }
        } catch (err) {
            console.log(err)
            return { status: false, err: err }
        }
    }

    async setUsed(token) {
        await knex.update({ used: 1 }).where({ token: token }).table("passwordtokens");
    }
}

module.exports = new PasswordToken();