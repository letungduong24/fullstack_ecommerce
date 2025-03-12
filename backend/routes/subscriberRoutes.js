const express = require('express')
const Subscriber = require('../models/Subscriber')
const router = express.Router()

// post /api/subscribe - handle newsletter subscription - public
router.post('/subscribe', async(req, res) => {
    const {email} = req.body;
    if(!email){
        return res.status(400).json({message: "Không có email"})
    }
    try {
        let subscriber = await Subscriber.findOne({email})
        if(subscriber){
            return res.status(400).json({message: "Email đã được đăng kí"})
        }
        subscriber = new Subscriber({email})
        await subscriber.save()
        res.status(201).json({message: "Đăng ký nhận tin mới thành công!"})
    } catch (error) {
        console.log(error)
        res.status(500).send({message: "Lỗi server"})
    }
})

module.exports = router