const express = require("express");
const { protect, admin } = require("../middleware/authMiddleware");
const ShopManager = require("../models/ShopManager");

const router = express.Router();


// put /api/products:id - update product - private/admin
router.put("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      categories,
      contact,
      announcement = '',
      heroImage,
      slogan
    } = req.body;
    const shopManager = await ShopManager.findById('shopmanager');
    if (shopManager) {
      shopManager.name = name || shopManager.name;
      shopManager.categories = categories || shopManager.categories;
      shopManager.contact = contact || shopManager.contact;
      shopManager.announcement = announcement; 
      shopManager.heroImage = heroImage || shopManager.heroImage;
      shopManager.slogan = slogan || shopManager.slogan;

      const updatedShopManager = await shopManager.save();
      res.status(200).json(updatedShopManager);
    } else {
      res.status(404).json({ message: "Không tìm thấy" });
    }
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ errors: messages });
    }
    res.status(500).json({ message: "Lỗi server" });
  }
});


// get /api/shop-manager - get shop info - public
router.get("/", async (req, res) => {
  try {
    const shopManager = await ShopManager.findById('shopmanager')
    res.status(200).json(shopManager);
  } catch (error) {
    console.log(error);
    res.status(500).send(error)
  }
});


module.exports = router;
