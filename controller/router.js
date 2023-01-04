const homeHandleRouter = require('./handleRouter/HomehandleRouter')
const userHandleRouter = require('./handleRouter/userHandleRouter')
const router = {
    'home': homeHandleRouter.showHome,
    'create': homeHandleRouter.createHome,
    'delete': homeHandleRouter.deleteProduct,
    'edit': homeHandleRouter.editHome,
    'login': userHandleRouter.login
}
module.exports = router

