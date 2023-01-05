const fs = require('fs');
const qs = require("qs");
const cookie = require('cookie');
const {raw} = require('mysql');
const {parse} = require('qs');
const userService = require("../../service/userService");
const HomeService = require("../../service/homeService");

class UserHandleRouter {

    showUser(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/user/aboutUser.html', 'utf-8', async (err, aboutUserHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    let homes = await userService.findAll();
                    // let userName = userCurrent.userName
                    let tbodys = '';
                    homes.map((user, indexs) => {
                        tbodys += `
                <tr >
                    <td>${indexs + 1}</td>
                    <td>${user.userName}</td>
                    <td>${user.password}</td>
                    <td>${user.jole}</td>
                    <td><a href="/edit/${user.idUser}"><button class="btn btn-outline-success">Sửa</button></a></td>
                    <td><a href="/delete/${user.idUser}"><button class="btn btn-outline-secondary">Xóa</button></a></td>
                   
                </tr>`
                    })
                    aboutUserHtml = aboutUserHtml.replace('{listUser}', tbodys);
                    // aboutUserHtml = aboutUserHtml.replace('{username}', userName);
                    res.writeHead(200, 'text/html');
                    res.write(aboutUserHtml);
                    res.end();
                }
            })
        }
    }

    login(req, res) {
        const cookies = cookie.parse(req.headers.cookie || '');
        let userCurrent = JSON.parse(cookies.name);
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
                    console.log(users)
                    res.setHeader('Set-Cookie', cookie.serialize('name', JSON.stringify(users[0]), {
                        httpOnly: true,
                        maxAge: 60 * 60 * 24 * 7 * 52
                    }));
                    if (users.length !== 0) {
                        if (users[0].jole === 'admin') {
                            res.writeHead(301, {'location': '/home'});
                            return res.end();
                        } else {
                            // let userName= userCurrent.userName;
                            // console.log(userName)
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