let knex = require("../database/connection");
let User = require("./User")

class PasswordToken {
    async create(user){
        try{
            var token = Date.now()
            await knex.insert({user_id: user.id, used: 0, token: token}).table('passwordtokens');
            return {status: true, token: token}
        } catch(err){
            console.log(err);
            return {status: false, err: err}
        }
    }
}

module.exports = new PasswordToken();