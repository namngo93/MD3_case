const connection = require('../model/connection');
connection.connected()
class UserService {

    findMember(){
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
    save(user){
        let connect = connection.getConnection();
        return new Promise((resolve,reject) => {
            connect.query( `insert into user ( userName, password, jole) 
                        values ('${user.userName}', '${user.password}', 'member')`, (err)=> {
                if (err){
                    console.log(err);
                }else {
                    resolve ('Create success')
                }
            })

        })
    }

}

module.exports = new UserService()