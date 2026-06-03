const { Category, Product, User } = require("./models")
const bcrypt = require("bcryptjs")

// Заполнение базы данных начальными данными
async function seed() {
    // Категории
    const categories = [
        "Чёрный", "Зелёный", "Белый", "Улун",
        "Пуэр", "Мате", "Габа", "Подарочные наборы", "Чайные церемонии"
    ]
    for (const name of categories) {
        await Category.findOrCreate({ where: { name } })
    }

    // Товары
    const products = [
        { category_id: 4, name: "Да Хун Пао",          price: 890,  weight: 50,  stock: 25, description: "Один из самых известных китайских улунов. Насыщенный вкус с нотами жжёного сахара и минералов.", image_url: "images/oolong.jpg" },
        { category_id: 4, name: "Те Гуань Инь",         price: 650,  weight: 50,  stock: 30, description: "Лёгкий улун с цветочным ароматом и сладковатым послевкусием. Классика китайского чаеводства.",   image_url: "images/oolong.jpg" },
        { category_id: 1, name: "Юньнань Дянь Хун",     price: 480,  weight: 50, stock: 40, description: "Элитный красный чай из провинции Юньнань. Медовый аромат, бархатистый вкус без терпкости.",       image_url: "images/black-tea.jpg" },
        { category_id: 1, name: "Ассам TGFOP",           price: 320,  weight: 50, stock: 50, description: "Крепкий индийский чай с солодовым вкусом. Идеален с молоком.",                                    image_url: "images/black-tea.jpg" },
        { category_id: 2, name: "Би Ло Чунь",           price: 750,  weight: 50,  stock: 20, description: "Весенний зелёный чай с фруктово-цветочным ароматом. Один из десяти знаменитых чаёв Китая.",        image_url: "images/green-tea.jpg" },
        { category_id: 2, name: "Сенча Фукамуши",       price: 420,  weight: 50, stock: 35, description: "Японский зелёный чай глубокой пропарки. Насыщенный умами вкус, изумрудный настой.",                 image_url: "images/green-tea.jpg" },
        { category_id: 3, name: "Бай Хао Инь Чжэнь",   price: 1200, weight: 50,  stock: 15, description: "Серебряные иглы — высший сорт белого чая. Тонкий вкус с медовыми нотами.",                         image_url: "images/white-tea.jpg" },
        { category_id: 3, name: "Бай Му Дань",          price: 680,  weight: 50,  stock: 22, description: "Белый пион — богатый цветочный аромат и освежающий вкус.",                                          image_url: "images/white-tea.jpg" },
        { category_id: 5, name: "Шу Пуэр 2020",         price: 560,  weight: 100, stock: 30, description: "Выдержанный шу пуэр с землистым вкусом и нотами тёмного шоколада.",                                 image_url: "images/puer.jpg" },
        { category_id: 5, name: "Шэн Пуэр Бин Ча",     price: 980,  weight: 50, stock: 10, description: "Прессованный блин шэн пуэра 2019 года. Яркий, терпкий вкус с потенциалом выдержки.",                image_url: "images/puer.jpg" },
        { category_id: 6, name: "Матэ Традисьональ",    price: 390,  weight: 50, stock: 40, description: "Аргентинский матэ высшего сорта. Бодрящий травяной вкус с лёгкой горчинкой.",                       image_url: "images/mate.jpg" },
        { category_id: 7, name: "Габа Улун",             price: 820,  weight: 50,  stock: 18, description: "Уникальный чай с повышенным содержанием ГАМК. Помогает снять стресс.",                              image_url: "images/gaba.jpg" },
        { category_id: 8, name: "Набор «Для начинающих»",  price: 2490, weight: 300, stock: 12, description: "Набор из 5 сортов чая в стильной подарочной упаковке.",                                             image_url: "images/gifts.jpg" },
        { category_id: 9, name: "Церемония Гун Фу Ча",  price: 3500, weight: 0,   stock: 8,  description: "Индивидуальная чайная церемония с мастером. 2 часа, 4–6 сортов чая.",                               image_url: "images/ceremony.jpg" },
    ]
    for (const p of products) {
        await Product.findOrCreate({ where: { name: p.name }, defaults: p })
    }

    // Администратор (пароль: admin123)
    const existing = await User.findOne({ where: { email: "admin@leafcup.ru" } })
    if (!existing) {
        const hashed = await bcrypt.hash("admin123", 10)
        await User.create({
            email: "admin@leafcup.ru",
            full_name: "Администратор",
            password: hashed,
            role: "admin"
        })
    }

    console.log("База данных заполнена начальными данными")
}

module.exports = seed
