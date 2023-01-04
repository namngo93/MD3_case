const connection = require('../model/connection');
connection.connected()
class CategoryService {
    findAll() {
        let sql = 'select * from category';
        let connect = connection.getConnection()
        return new Promise((resolve, reject) => {
            connect.query(sql, (err, categories) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(categories);
                }
            })
        })
    }

    findByID(id){
        let connect = connection.getConnection();
        let sql = `select * from category where idS = ${id}`;
        return new Promise((resolve,reject) =>{
            connect.query(sql,(err,list) =>{
                if (err){
                    reject (err)
                }else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }
}
module.exports = new CategoryService();