const mysql = require ('mysql')
class Connection{
    configToMySQL ={
        host: 'localhost',
        user: 'root',
        password: '12345678',
        charset: 'utf8_general_ci',
        database:'case_md3'
    }

    getConnection() {
        return mysql.createConnection(this.configToMySQL);

    }

    connected(){
        this.getConnection().connect(err => {
            if (err){
                console.log(err)
            }else {
                console.log('Connection success')
            }
        })
    }
}
module.exports = new Connection();