const express = require('express');
const User = require('../models/User')
const jwt = require('jsonwebtoken')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router();

// post /api/users/register - register user - public
router.post('/register', async (req, res) => {
    const {name, email, password} = req.body
    try{
        let user = await User.findOne({email})

        if(user) return res.status(400).json({message: 'Người dùng đã tồn tại'})

        user = new User({name, email, password})
        await user.save();

        // tạo payload, định dạng cần mã hóa và giải mã
        const payload = {user: {id: user._id, role: user.role}}

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '40h'}, (err, token) => {
            if(err) throw err;
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }, token
            })
        })
        
    } catch(err){
        console.log(err)
        return res.status(500).json({message: 'Lỗi không xác định'})
    }
})

// post /api/users/login - auth user - public
router.post('/login', async (req, res) => {
    const {email, password} = req.body

    try{
        let user = await User.findOne({email})
        if (!user) return res.status(400).json({message: 'Thông tin không hợp lệ.'})
        const isMatch = await user.matchPassword(password)
        if(!isMatch) return res.status(400).json({message: 'Thông tin không hợp lệ'})
            const payload = {user: {id: user._id, role: user.role}}

        jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: '40h'}, (err, token) => {
            if(err) throw err;
            res.status(201).json({
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }, token
            })
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Lỗi server')
    }
})

// get /api/users/profile - get user info - protected
router.get('/profile', protect,  async (req, res) => {
    res.json(req.user)

})
module.exports = router