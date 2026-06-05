const { Order, OrderItem, Product } = require("../database/models")
const jwt = require("jsonwebtoken")

const JWT_SECRET = "LEAFCUP_SECRET_KEY"

function getPayloads(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return {}
    }
}

class OrderController {

    async CreateOrder(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (!payloads.id) {
                return resp.status(401).send("Необходима авторизация!")
            }

            const { address, payment, items } = req.body

            if (!address || !payment || !items || items.length === 0) {
                return resp.status(400).send("Заполните все поля заказа!")
            }

            const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

            const order = await Order.create({
                user_id: payloads.id,
                address,
                payment,
                status: "new",
                total
            })

            for (const item of items) {
                await OrderItem.create({
                    order_id: order.id,
                    product_id: item.product_id,
                    name: item.name,
                    quantity: item.quantity,
                    price: item.price
                })

                await Product.decrement("stock", {
                    by: item.quantity,
                    where: { id: item.product_id }
                })
            }

            resp.status(201).json({ id: order.id, status: order.status, total: order.total })
        } catch (err) {
            console.error(`ERROR in CreateOrder: ${err.name}`)
            resp.status(500).send("Не удалось создать заказ!")
        }
    }

    async GetMyOrders(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (!payloads.id) {
                return resp.status(401).send("Необходима авторизация!")
            }

            const orders = await Order.findAll({
                where: { user_id: payloads.id },
                include: [{ model: OrderItem }],
                order: [["created_at", "DESC"]]
            })

            resp.status(200).json(orders)
        } catch (err) {
            console.error(`ERROR in GetMyOrders: ${err.name}`)
            resp.status(500).send("Не удалось получить заказы!")
        }
    }

    async GetAllOrders(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (payloads.role !== "admin") {
                return resp.status(403).send("Доступ запрещён!")
            }

            const orders = await Order.findAll({
                include: [{ model: OrderItem }],
                order: [["created_at", "DESC"]]
            })

            resp.status(200).json(orders)
        } catch (err) {
            console.error(`ERROR in GetAllOrders: ${err.name}`)
            resp.status(500).send("Не удалось получить заказы!")
        }
    }

    async UpdateOrderStatus(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (payloads.role !== "admin") {
                return resp.status(403).send("Доступ запрещён!")
            }

            const { status } = req.body
            await Order.update({ status }, { where: { id: req.params.id } })

            resp.status(200).json({ message: "Статус обновлён" })
        } catch (err) {
            console.error(`ERROR in UpdateOrderStatus: ${err.name}`)
            resp.status(500).send("Ошибка сервера!")
        }
    }
}

module.exports = new OrderController()
