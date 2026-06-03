const Router = require("express")
const router = new Router()
const UserController = require("../api/user")

router.post("/register", (req, resp) => UserController.CreateUser(req, resp))
router.post("/login",    (req, resp) => UserController.LoginUser(req, resp))
router.post("/logout",   (req, resp) => UserController.LogoutUser(req, resp))
router.get("/me",        (req, resp) => UserController.GetMe(req, resp))
router.patch("/me",      (req, resp) => UserController.UpdateMe(req, resp))
router.get("/all",       (req, resp) => UserController.GetAllUsers(req, resp))

module.exports = router
