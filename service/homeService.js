const connection = require('../model/connection');
connection.connected()
class HomeService {
    findAll(){
        let sql= 'select * from home p join category c on c.idS = p.idS';
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

    findByID(id){
        let connect = connection.getConnection();
        let sql = `select * from home join category c on home.idS = c.idS where id = ${id}`;
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

    findByName(name){
        let connect = connection.getConnection();
        let sql = `select * from home p join category c on c.idS = p.idS where name like '%${name}%'`;
        return new  Promise((resolve,reject) =>{
            connect.query(sql, (err, list) =>{
                if (err){
                    reject(err)
                }else {
                    console.log('Success');
                    resolve(list);
                }
            })
        })
    }

    save(home){
        let connect = connection.getConnection()
        connect.query( `insert into home ( price, name, address, description, image, idS) 
                        values (${home.price}, "${home.name}", '${home.address}','${home.description}','${home.image}',${home.idCategory})`, (err)=> {
            if (err){
                console.log(err);
            }
        })
    }

    edit(home, category, id){
        let connect = connection.getConnection();
        return new Promise((resolve,reject) =>{
            connect.query(`update home
             join category on home.idS = category.idS
            set home.name = '${home.name}',
                home.address = '${home.address}',
               home.price = ${home.price},
                home.image = '${home.image}',
                home.description ='${home.description}',
            home.idS = ${category}
            where id = ${id}`,(err, home) =>{
                if (err){
                    reject(err);
                }else {
                    console.log('Success');
                    resolve(home);
                }
            })
        })
    }

    remove(id){
        let connect = connection.getConnection();
        let sql = `delete from home where id = ${id}`;
        connect.query( sql, (err)=> {
            if (err){
                console.log(err);
            }
        })
    }
}
module.exports =  new HomeService()
