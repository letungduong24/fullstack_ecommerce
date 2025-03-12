const mongoose = require('mongoose')
const dotenv = require('dotenv')
const Product = require('./models/Product')
const User = require('./models/User')
const products = require('./data/product')
const Cart = require('./models/Cart')
const Order = require('./models/Order')
const ShopManager = require('./models/ShopManager')

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const seedData = async () => {
    try {
        await Product.deleteMany()
        await User.deleteMany()
        await Cart.deleteMany()
        await ShopManager.deleteMany()
        await Order.deleteMany()
        const createdUser = await User.create({
            name: 'Admin',
            email: 'admin@theshop.com',
            password: '123456',
            role: 'Quản trị viên',
        })

        const userID = createdUser._id;

        const sampleProducts = products.map((product) => {
            return {...product, user: userID}
        })

        await Product.insertMany(sampleProducts)
        const shopManager = await ShopManager.create({
            name: 'TheShop',
            categories: [
                'Áo', 'Quần', 'Túi', 'Mũ'
            ],
            heroImage: 'https://res.cloudinary.com/dfemfoftc/image/upload/v1741793785/zm7noykwpztvcujp176e.jpg',
            announcement: 'Vận chuyển toàn quốc - Miễn phí vận chuyển cho đơn hàng từ 100.000vnđ',
            contact: {
                meta: '',
                x: '',
                instagram: '',
                tiktok: '',
                phone: '+84865641682'
            },
            slogan: 'Tiệm quần áo nam chất lượng với dịch vụ giao nhanh toàn quốc.'
        })
        console.log("Seed success")
        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

seedData();