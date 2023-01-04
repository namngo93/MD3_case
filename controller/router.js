const homeHandleRouter = require('./handleRouter/HomehandleRouter')
const userHandleRouter = require('./handleRouter/userHandleRouter')

const router = {
    'homeUser': homeHandleRouter.showHomeMember,
    'home': homeHandleRouter.showHome,
    'create': homeHandleRouter.createHome,
    'delete': homeHandleRouter.deleteProduct,
    'edit': homeHandleRouter.editHome,
    'login': userHandleRouter.login,
    'signup': userHandleRouter.Signup

}
module.exports = router

