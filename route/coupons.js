const coupons = require('../model/coupons')
const express = require('express')
const router = express.Router()
const Controller = require('../controller/coupons')


router.get('/', async(req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)

        const start = (page - 1) * limit
        const end = page * limit

        const allCoupons = {}

        if (start > 0) {
            allCoupons.previous = {
                page: page - 1
            }
        }

        allCoupons.couponData = await coupons.find().limit(limit).skip(start).exec()

        if (end < await coupons.countDocuments().exec()) {
            allCoupons.next = {
                page: page + 1
            }
        }
        return res.status(200).json(allCoupons)
    } catch (err) {
        console.log(err)
    }
})


router.post('/create', Controller.createCoupon)
router.put("/update/:id", Controller.updateCoupon)
router.get('/search', Controller.searchCoupon)
router.get('/:id', Controller.getCoupon)
router.delete('/delete/:id', Controller.deleteCoupon)

module.exports = router;