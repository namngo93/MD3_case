const fs = require('fs');
const HomeService = require('../../service/homeService');
const categoryService = require('../../service/categoryService');
const qs = require('qs')
const cookie = require('cookie');
class HomeHandleRouter {

    static getHomeMemberHtml(userName,homes, homeUserHtml) {
        let tbodys = '';
        homes.map((home, indexs) => {
            tbodys += `
                <tr >
                    <td>${indexs + 1}</td>
                    <td>${home.name}</td>
                    <td>${home.address}</td>
                    <td>${home.price}</td>
                    <td>${home.description}</td>
                    <td>${home.nameCategory}</td>
                    <td><img style="width: 200px; height: 180px" src="/img/${home.image}" alt=""></td>
                   
                </tr>`
        })
        homeUserHtml = homeUserHtml.replace('{list}', tbodys);
        homeUserHtml = homeUserHtml.replace('{username}', userName);
        return homeUserHtml;
    }

    showHomeMember(req, res) {
        const cookies = cookie.parse(req.headers.cookie || '');
        let userCurrent = JSON.parse(cookies.name);
        if (req.method === 'GET') {
            fs.readFile('./views/homeUser.html', 'utf-8', async (err, homeUserHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    let a = await HomeService.findAll();
                    let userName = userCurrent.userName
                    homeUserHtml = HomeHandleRouter.getHomeMemberHtml(userName,a, homeUserHtml)
                    res.writeHead(200, 'text/html');
                    res.write(homeUserHtml);
                    res.end();
                }
            })
        } else {                          // Search bằng tên gần đúng
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    let search = qs.parse(data);
                    fs.readFile('./views/homeUser.html', "utf-8", async (err, indexsHtml) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let userName = userCurrent.userName
                            let list = await HomeService.findByName(search.search);
                            console.log(list)
                            indexsHtml = HomeHandleRouter.getHomeMemberHtml(userName,list, indexsHtml)
                            res.writeHead(200, {'location': '/homeUser'});
                            res.write(indexsHtml);
                            res.end();
                        }
                    })

                }
            })
        }
    }
    static getHomeHtml(homes, homeHtml) {
        let tbody = '';
        homes.map((home, index) => {
            tbody += `
                <tr style="text-align: center">
                    <td>${index + 1}</td>
                    <td>${home.name}</td>
                    <td>${home.address}</td>
                    <td>${home.price}</td>
                    <td>${home.description}</td>
                    <td>${home.nameCategory}</td>
                    <td><img style="width: 200px; height: 180px" src="/img/${home.image}" alt=""></td>
                    <td><a href="/edit/${home.id}"><button class="btn btn-outline-success">Sửa</button></a></td>
                    <td><a href="/delete/${home.id}"><button class="btn btn-outline-secondary">Xóa</button></a></td>
                </tr>`
        })
        homeHtml = homeHtml.replace('{list}', tbody);
        return homeHtml;
    }


    showHome(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/home.html', 'utf-8', async (err, homeHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    let a = await HomeService.findAll();
                    homeHtml = HomeHandleRouter.getHomeHtml(a, homeHtml)
                    res.writeHead(200, 'text/html');
                    res.write(homeHtml);
                    res.end();
                }
            })
        } else {                          // Search bằng tên gần đúng
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    let search = qs.parse(data);
                    fs.readFile('./views/home.html', "utf-8", async (err, indexHtml) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let list = await HomeService.findByName(search.search);
                            console.log(list)
                            indexHtml = HomeHandleRouter.getHomeHtml(list, indexHtml)
                            res.writeHead(200, {'location': '/home'});
                            res.write(indexHtml);
                            res.end();
                        }
                    })

                }
            })
        }
    }

    createHome(req, res) {
        if (req.method === 'GET') {
            fs.readFile('./views/create.html', 'utf-8', async (err, createHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    let categories = await categoryService.findAll();
                    let options = '';
                    categories.map(category => {
                        options += `
                                   <option value='${category.idS}'>${category.nameCategory}</option>
                                   `
                    })
                    createHtml = createHtml.replace('{categories}', options);
                    res.write(createHtml);
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
                    const home = qs.parse(data);
                    HomeService.save(home);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }

    async deleteProduct(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/delete.html', 'utf-8', (err, deleteHtml) => {
                if (err) {
                    console.log(err)
                } else {
                    res.writeHead(200, 'text/html');
                    deleteHtml = deleteHtml.replace('{id}', id);
                    res.write(deleteHtml);
                    res.end();
                }
            })
        } else {
            await HomeService.remove(id);
            res.writeHead(301, {'location': '/home'});
            res.end();
        }
    }

    async editHome(req, res, id) {
        if (req.method === 'GET') {
            fs.readFile('./views/edit.html', 'utf-8', async (err, editHtml) => {
                if (err) {
                    console.log(err.message)
                } else {
                    let home = await HomeService.findByID(id);
                    let categories = await categoryService.findAll()
                    let options = '';
                    categories.map(category => {
                        options += `
                                   <option value='${category.idS}'>${category.nameCategory}</option>
                                   `
                    })
                    editHtml = editHtml.replace('{categories}', options);
                    editHtml = editHtml.replace('{name}', home[0].name);
                    editHtml = editHtml.replace('{address}', home[0].address);
                    editHtml = editHtml.replace('{price}', home[0].price);
                    editHtml = editHtml.replace('{description}', home[0].description);
                    editHtml = editHtml.replace('{image}',home[0].image)
                    editHtml = editHtml.replace('{nameCategory}', home[0].nameCategory);
                    editHtml = editHtml.replace('{id}', id);
                    res.writeHead(200, 'text/html');
                    res.write(editHtml);
                    res.end();
                }
            })
        } else {
            let data = '';
            req.on('data', chunk => {
                data += chunk;
            })
            req.on('end', async err => {
                if (err) {
                    console.log(err)
                } else {
                    const home = qs.parse(data);
                    const category = home.idCategory
                    await HomeService.edit(home,category, id);
                    res.writeHead(301, {'location': '/home'});
                    res.end();
                }
            })
        }
    }
}

module.exports = new HomeHandleRouter();