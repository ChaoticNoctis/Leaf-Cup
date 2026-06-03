const { Sequelize } = require("sequelize")
const path = require("path")

// Подключение к базе данных SQLite
// Файл базы данных создаётся автоматически при первом запуске
const sequelize = new Sequelize({
    dialect: "sqlite",
    storage: path.join(__dirname, "leafcup.db"),
    logging: false  // отключаем SQL-логи в консоли
})

module.exports = sequelize
