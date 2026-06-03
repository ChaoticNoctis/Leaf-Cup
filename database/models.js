const { DataTypes, Model } = require("sequelize")
const sequelize = require("./database")

// ─── Модель пользователя ──────────────────────────────────────────────────────
class User extends Model {}
User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    full_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: "user"
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: "user",
    timestamps: false
})

// ─── Модель категории ─────────────────────────────────────────────────────────
class Category extends Model {}
Category.init({
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
}, {
    sequelize,
    modelName: "category",
    timestamps: false
})

// ─── Модель товара ────────────────────────────────────────────────────────────
class Product extends Model {}
Product.init({
    category_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: ""
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    weight: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    image_url: {
        type: DataTypes.STRING,
        defaultValue: ""
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: "product",
    timestamps: false
})

// ─── Модель заказа ────────────────────────────────────────────────────────────
class Order extends Model {}
Order.init({
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    payment: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "new"
    },
    total: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    sequelize,
    modelName: "order",
    timestamps: false
})

// ─── Модель позиции заказа ────────────────────────────────────────────────────
class OrderItem extends Model {}
OrderItem.init({
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "order_item",
    timestamps: false
})

// ─── Связи между моделями ─────────────────────────────────────────────────────
User.hasMany(Order, { foreignKey: "user_id" })
Order.belongsTo(User, { foreignKey: "user_id" })

Category.hasMany(Product, { foreignKey: "category_id" })
Product.belongsTo(Category, { foreignKey: "category_id" })

Order.hasMany(OrderItem, { foreignKey: "order_id" })
OrderItem.belongsTo(Order, { foreignKey: "order_id" })

Product.hasMany(OrderItem, { foreignKey: "product_id" })
OrderItem.belongsTo(Product, { foreignKey: "product_id" })

module.exports = { User, Category, Product, Order, OrderItem }
