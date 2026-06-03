const Router = require("express")
const router = new Router()
const ProductController = require("../api/product")

router.get("/",              (req, resp) => ProductController.GetProducts(req, resp))
router.get("/categories",    (req, resp) => ProductController.GetCategories(req, resp))
router.get("/:id",           (req, resp) => ProductController.GetProductById(req, resp))
router.post("/",             (req, resp) => ProductController.CreateProduct(req, resp))
router.put("/:id",           (req, resp) => ProductController.UpdateProduct(req, resp))
router.delete("/:id",        (req, resp) => ProductController.DeleteProduct(req, resp))

module.exports = router
