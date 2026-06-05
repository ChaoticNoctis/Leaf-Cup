const { Product, Category } = require("../database/models")
const jwt = require("jsonwebtoken")

const JWT_SECRET = "LEAFCUP_SECRET_KEY"

function getPayloads(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return {}
    }
}

class ProductController {

    async GetProducts(req, resp) {
        try {
            const { category_id, search } = req.query
            const where = { is_active: true }

            if (category_id) {
                where.category_id = category_id
            }

            let products = await Product.findAll({
                where,
                include: [{ model: Category, attributes: ["name"] }],
                order: [["id", "ASC"]]
            })

            if (search) {
                const q = search.toLowerCase()
                products = products.filter(p =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
                )
            }

            resp.status(200).json(products)
        } catch (err) {
            console.error(`ERROR in GetProducts: ${err.name}`)
            resp.status(500).send("Не удалось получить товары!")
        }
    }

    async GetProductById(req, resp) {
        try {
            const product = await Product.findByPk(req.params.id, {
                include: [{ model: Category, attributes: ["name"] }]
            })
            if (!product || !product.is_active) {
                return resp.status(404).send("Товар не найден!")
            }
            resp.status(200).json(product)
        } catch (err) {
            console.error(`ERROR in GetProductById: ${err.name}`)
            resp.status(500).send("Ошибка сервера!")
        }
    }

    async GetCategories(req, resp) {
        try {
            const categories = await Category.findAll({ order: [["id", "ASC"]] })
            resp.status(200).json(categories)
        } catch (err) {
            console.error(`ERROR in GetCategories: ${err.name}`)
            resp.status(500).send("Не удалось получить категории!")
        }
    }

    async CreateProduct(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (payloads.role !== "admin") {
                return resp.status(403).send("Доступ запрещён!")
            }

            const { category_id, name, description, price, weight, stock, image_url } = req.body

            if (!name || !price || !category_id) {
                return resp.status(400).send("Заполните обязательные поля!")
            }

            const product = await Product.create({
                category_id,
                name,
                description: description || "",
                price: parseInt(price),
                weight: parseInt(weight) || 0,
                stock: parseInt(stock) || 0,
                image_url: image_url || "images/green-tea.jpg"
            })

            resp.status(201).json(product)
        } catch (err) {
            console.error(`ERROR in CreateProduct: ${err.name}`)
            resp.status(400).send("Некорректные данные!")
        }
    }

    // Редактирование товара (только администратор)
    async UpdateProduct(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (payloads.role !== "admin") {
                return resp.status(403).send("Доступ запрещён!")
            }

            const { category_id, name, description, price, weight, stock, image_url } = req.body

            await Product.update({
                category_id,
                name,
                description,
                price: parseInt(price),
                weight: parseInt(weight) || 0,
                stock: parseInt(stock) || 0,
                image_url
            }, { where: { id: req.params.id } })

            resp.status(200).json({ message: "Товар обновлён" })
        } catch (err) {
            console.error(`ERROR in UpdateProduct: ${err.name}`)
            resp.status(500).send("Ошибка сервера!")
        }
    }

    // Удаление товара — мягкое (только администратор)
    async DeleteProduct(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (payloads.role !== "admin") {
                return resp.status(403).send("Доступ запрещён!")
            }

            await Product.update(
                { is_active: false },
                { where: { id: req.params.id } }
            )

            resp.status(200).json({ message: "Товар удалён" })
        } catch (err) {
            console.error(`ERROR in DeleteProduct: ${err.name}`)
            resp.status(500).send("Ошибка сервера!")
        }
    }
}

module.exports = new ProductController()
