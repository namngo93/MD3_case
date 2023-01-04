const connection = require('../model/connection');
connection.connected()
class UserService {
    login(user) {
        let sql = `select * from user where userName = '${user.userName}' and password ='${user.password}'`;
        let connect = connection.getConnection()
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            })
        })
    }
}

module.exports = new UserService()