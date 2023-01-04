const fs = require('fs');
const qs = require("qs");
const cookie = require('cookie');
const alert  = require('alert')
const {raw} = require('mysql');
const {parse} = require('qs');
const userService = require("../../service/userService");

class UserHandleRouter {

    login(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/login.html', 'utf-8', async (err, loginHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    res.write(loginHtml);
                    res.end();
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    let user = qs.parse(data)
                    let users = await userService.login(user)
                    res.setHeader('Set-Cookie', cookie.serialize('name', JSON.stringify(user[0]), {
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 7 * 52
                    }));
                    if (users.length !== 0) {
                        if (users[0].jole === 'admin') {
                            res.writeHead(301, {'location': '/home'});
                            return res.end();
                        } else {
                            res.writeHead(301, {'location': '/homeUser'});
                            return res.end();
                        }

                    } else {
                        res.writeHead(301, {'location': '/login'});
                        res.end();
                    }
                }
            })
        }
    }

    Signup(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/signup.html', 'utf-8', async (err, signHtml) => {
                if (err) {
                    console.log(err)
                } else {

                    res.writeHead(200, 'text/html');
                    res.write(signHtml);
                    res.end();
                }
            })
        } else {
            let data = ''
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const user = qs.parse(data);
                    let result = await userService.save(user);
                    if (result === 'Loi') {
                        res.writeHead(301, {'location': '/signup'});
                        alert('Tài khoản đã tồn tại')
                        res.end();
                    } else {
                        res.writeHead(301, {'location': '/login'});
                        res.end();
                    }
                }
            })
        }
    }

    Member(req, res) {
        const cookies = cookie.parse(req.headers.cookie || '');
        let userCurrent = JSON.parse(cookies.name);
        fs.readFile('./views/user/signup.html', "utf-8", async (err, managementHtml) => {
            if (err) {
                console.log(err)
            } else if (userCurrent.role === "admin") {
                res.writeHead(200, {'location': '/home'});
                res.write(managementHtml);
                res.end();
            } else {
                res.writeHead(200, {'location': '/homeUser'});
                res.end();
            }
        })
    }
}


module.exports = new UserHandleRouter()