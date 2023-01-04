const fs = require('fs')
const qs = require("qs");
const cookie = require('cookie')
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
                    let users = userService.login(user)
                    if (users.length !== 0) {
                        res.setHeader('Set-Cookie', cookie.serialize('name', JSON.stringify(user[0]), {
                            httpOnly: true,
                            maxAge: 60 * 60 * 24 * 7 * 52
                        }));
                        res.writeHead(301, {'location': '/home'});
                        res.end();
                    } else {
                        res.writeHead(301, {'location': '/login'});
                        res.end();
                    }
                }
            })
        }
    }
}



module.exports = new UserHandleRouter()