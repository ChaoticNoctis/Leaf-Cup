const express      = require("express")
const cors         = require("cors")
const cookieParser = require("cookie-parser")
const fileUpload   = require("express-fileupload")
const path         = require("path")

const userRouter    = require("../routes/Users")
const productRouter = require("../routes/Products")
const orderRouter   = require("../routes/Orders")

const sequelize = require("../database/database")
const { User, Category, Product, Order, OrderItem } = require("../database/models")
const seed = require("../database/seed")

class Server {
    constructor(host, port) {
        this.app  = express()
        this.host = host
        this.port = port
    }

    initUserApi() {
        this.app.use("/api/user", userRouter)
    }

    initProductApi() {
        this.app.use("/api/product", productRouter)
    }

    initOrderApi() {
        this.app.use("/api/order", orderRouter)
    }

    initApi() {
        this.initUserApi()
        this.initProductApi()
        this.initOrderApi()
    }

    async Start() {
        // Middleware
        this.app.use(express.json())

        this.app.use(cors({
            origin: [
                "http://localhost:3000",
                "http://127.0.0.1:3000",
                "http://localhost:8080",
                "http://127.0.0.1:8080"
            ],
            credentials: true
        }))

        this.app.use(cookieParser())
        this.app.use(fileUpload({}))

        // Static files
        this.app.use("/assets", express.static(path.join(__dirname, "../assets")))
        this.app.use("/images", express.static(path.join(__dirname, "../client/images")))
        this.app.use("/styles", express.static(path.join(__dirname, "../client/styles")))
        this.app.use("/js", express.static(path.join(__dirname, "../client/js")))

        // Pages
        const sendPage = (page) => (req, res) =>
            res.sendFile(path.join(__dirname, `../client/${page}.html`))

        this.app.get(["/", "/index.html"], sendPage("index"))
        this.app.get(["/catalog", "/catalog.html"], sendPage("catalog"))
        this.app.get(["/cart", "/cart.html"], sendPage("cart"))
        this.app.get(["/account", "/account.html"], sendPage("account"))
        this.app.get(["/admin", "/admin.html"], sendPage("admin"))
        this.app.get(["/articles", "/articles.html"], sendPage("articles"))
        this.app.get(["/ceremonies", "/ceremonies.html"], sendPage("ceremonies"))
        this.app.get(["/sales", "/sales.html"], sendPage("sales"))

        // API
        this.initApi()

        // DB
        await sequelize.sync()
        await seed()

        // Server start
        this.app.listen(this.port, "0.0.0.0", (err) => {
            if (err) {
                console.error("Не удалось запустить сервер:", err)
            } else {
                console.log(`Server running on port ${this.port}`)
            }
        })
    }
}

const host = "0.0.0.0"
const port = process.env.PORT || 8081

const serverInstance = new Server(host, port)

module.exports = serverInstance