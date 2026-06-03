const Router = require("express")
const router = new Router()
const OrderController = require("../api/order")

router.post("/",           (req, resp) => OrderController.CreateOrder(req, resp))
router.get("/my",          (req, resp) => OrderController.GetMyOrders(req, resp))
router.get("/all",         (req, resp) => OrderController.GetAllOrders(req, resp))
router.patch("/:id/status",(req, resp) => OrderController.UpdateOrderStatus(req, resp))

module.exports = router
