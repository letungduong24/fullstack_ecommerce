const mongoose = require('mongoose');

const shopManagerSchema = new mongoose.Schema({
    _id: { type: String, default: 'shopmanager' }, // Hardcode ID
    name: String,
    categories: [String],
    heroImage: String,
    announcement: String,
    contact: {
        meta: String,
        x: String,
        instagram: String,
        tiktok: String,
        phone: String
    },
    slogan: String,
}, { _id: false });

module.exports = mongoose.model('ShopManager', shopManagerSchema);
