const { User } = require("../database/models")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const JWT_SECRET = "LEAFCUP_SECRET_KEY"

function getPayloads(token) {
    try {
        return jwt.verify(token, JWT_SECRET)
    } catch {
        return {}
    }
}

class UserController {

    // Регистрация нового пользователя
    async CreateUser(req, resp) {
        try {
            const { email, full_name, password } = req.body

            if (!email || !full_name || !password) {
                return resp.status(400).send("Заполните все поля!")
            }
            if (password.length < 6) {
                return resp.status(400).send("Пароль должен быть не менее 6 символов!")
            }

            const existing = await User.findOne({ where: { email } })
            if (existing) {
                return resp.status(409).send("Пользователь с таким email уже существует!")
            }

            bcrypt.hash(password, 10).then(async (hashedPassword) => {
                const user = await User.create({
                    email,
                    full_name,
                    password: hashedPassword
                })

                const token = jwt.sign(
                    { id: user.id, full_name: user.full_name, role: user.role },
                    JWT_SECRET
                )

                resp.status(201).cookie("token", token, {
                    maxAge: 128000000,
                    httpOnly: true,
                    sameSite: "lax",
                    path: "/"
                }).json({
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                })
            })
        } catch (err) {
            console.error(`ERROR in CreateUser: ${err.name}`)
            resp.status(400).send("Некорректные данные!")
        }
    }

    async LoginUser(req, resp) {
        try {
            const { email, password } = req.body

            if (!email || !password) {
                return resp.status(400).send("Заполните все поля!")
            }

            const user = await User.findOne({ where: { email } })
            if (!user) {
                return resp.status(401).send("Неверный email или пароль!")
            }

            const isValid = await bcrypt.compare(password, user.password)
            if (!isValid) {
                return resp.status(401).send("Неверный email или пароль!")
            }

            const token = jwt.sign(
                { id: user.id, full_name: user.full_name, role: user.role },
                JWT_SECRET
            )

            resp.status(200).cookie("token", token, {
                maxAge: 128000000,
                httpOnly: true,
                sameSite: "lax",
                path: "/"
            }).json({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role
            })
        } catch (err) {
            console.error(`ERROR in LoginUser: ${err.name}`)
            resp.status(500).send("Ошибка сервера!")
        }
    }

    async LogoutUser(req, resp) {
        resp.clearCookie("token").json({ message: "Выход выполнен" })
    }

    async GetMe(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (!payloads.id) {
                return resp.status(401).send("Не авторизован!")
            }

            const user = await User.findByPk(payloads.id)
            if (!user) {
                return resp.status(404).send("Пользователь не найден!")
            }

            resp.status(200).json({
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
                created_at: user.created_at
            })
        } catch (err) {
            console.error(`ERROR in GetMe: ${err.name}`)
            resp.status(500).send("Ошибка сервера!")
        }
    }

    async UpdateMe(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (!payloads.id) {
                return resp.status(401).send("Не авторизован!")
            }

            const { full_name } = req.body
            if (!full_name) {
                return resp.status(400).send("Введите имя!")
            }

            await User.update({ full_name }, { where: { id: payloads.id } })
            resp.status(200).json({ message: "Профиль обновлён" })
        } catch (err) {
            console.error(`ERROR in UpdateMe: ${err.name}`)
            resp.status(500).send("Ошибка сервера!")
        }
    }

    async GetAllUsers(req, resp) {
        try {
            const payloads = getPayloads(req.cookies.token)
            if (payloads.role !== "admin") {
                return resp.status(403).send("Доступ запрещён!")
            }

            const users = await User.findAll({
                attributes: ["id", "email", "full_name", "role", "created_at"]
            })
            resp.status(200).json(users)
        } catch (err) {
            console.error(`ERROR in GetAllUsers: ${err.name}`)
            resp.status(500).send("Ошибка сервера!")
        }
    }
}

module.exports = new UserController()
