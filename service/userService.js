const connection = require('../model/connection');
connection.connected()
class UserService {

    findAll(){
        let sql= 'select * from user';
        let connect = connection.getConnection()
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, home)=> {
                if (err){
                    reject ( err);
                }else {
                    resolve(home) ;
                }
            })
        })
    }


    login(user) {
        let sql = `select * from user where userName = '${user.username}' and password ='${user.password}'`;
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

    checkName(username) {
        let connect = connection.getConnection();
        return new Promise((resolve,reject) => {
            connect.query( `select * from user where userName = '${username}'`, (err, data)=> {
                if (err){
                    reject ('err')
                }else {
                    resolve (data)
                }
            })

        })
    }
    async save(user){
        let connect = connection.getConnection();
        let checkUser = await this.checkName(user.userName);
        if(checkUser.length !== 0) {
            return 'Loi'
        } else {
            return new Promise((resolve,reject) => {
                connect.query( `insert into user ( userName, password, jole) 
                        values ('${user.userName}', '${user.password}', 'member')`, (err)=> {
                    if (err){
                        reject ('err')
                    }else {
                        resolve ('Create success')
                    }
                })

            })
        }
    }

}

module.exports = new UserService()