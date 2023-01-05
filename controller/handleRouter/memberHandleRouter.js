const fs = require('fs');
const qs = require("qs");
const cookie = require('cookie')
const userMemberService = require("../../service/userMemberService");



class memberHandleRouter {

    loginMember(req, res) {

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
                    let member = qs.parse(data)
                    let users = userMemberService.login(member)
                    if (member.length !== 0) {
                        res.setHeader('Set-Cookie', cookie.serialize('name', JSON.stringify(member[0]), {
                            httpOnly: true,
                            maxAge: 60 * 60 * 24 * 7 * 52
                        }));
                        res.writeHead(301, {'location': '/homeUser'});
                        res.end();
                    } else {
                        res.writeHead(301, {'location': '/login'});
                        res.end();
                    }
                }
            })
        }
    }

    SignupMember(req, res) {
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
            req.on('end', err => {
                if (err) {
                    console.log(err)
                } else {
                    const member = qs.parse(data);
                    userMemberService.save(member);
                    res.writeHead(301, {'location': '/login'});
                    res.end();
                }
            })
        }
    }

//     Member(req,res){
//         const cookies = cookie.parse(req.headers.cookie || '');
//         let userCurrent = JSON.parse(cookies.name);
//         fs.readFile('./views/user/signup.html', "utf-8", async (err, managementHtml) => {
//             if (err) {
//                 console.log(err)
//             } else if(userCurrent.role === "admin") {
//                 res.writeHead(200, {'location': '/home'});
//                 res.write(managementHtml);
//                 res.end();
//             } else{
//                 res.writeHead(200, {'location': '/homeUser'});
//                 res.end();
//             }
//         })
//     }
// }
}



module.exports = new memberHandleRouter()