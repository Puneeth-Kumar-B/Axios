const express = require('express')
const app = express()
app.use(express.json())
const axios = require('axios')


let SampleUrl = 'http://localhost:3000/coupons'


app.get('/myserver/couponData', async(req, res) => {
    try {
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        let params = {}
        if (page) params.page = page
        if (limit) params.limit = limit
        let response = await axios.get(SampleUrl, { params })
        return res.json(response.data)
    } catch (e) {
        res.json(e)
    }
})


app.post('/myserver/createCoupon', async(req, res, next) => {
    try {
        let body = req.body
        let response = await axios.post(SampleUrl + '/create', body)
        res.status(200).json({ message: "Coupon Created Successfully", data: response.data.data })
        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
    }
})


app.put('/myserver/updateCoupon/:id', async(req, res, next) => {
    try {
        let body = req.body
        let response = await axios.put(`${SampleUrl}/update/${req.params.id}`, body)
        res.status(200).json({ message: "Coupon Updated Successfully", data: response.data.data })
        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
    }
})


app.get('/myserver/searchCoupon', async(req, res, next) => {
    try {
        let { status, search } = req.query
        const page = parseInt(req.query.page)
        const limit = parseInt(req.query.limit)
        let params = {}
        if (status) params.status = status
        if (search) params.search = search
        if (page) params.page = page
        if (limit) params.limit = limit
        let response = await axios.get(SampleUrl + '/search', { params })
        res.status(200).json(response.data)
        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
    }
})


app.get('/myserver/getCoupon/:id', async(req, res, next) => {
    try {
        let response = await axios.get(`${SampleUrl}/${req.params.id}`)
        res.status(200).json(response.data)
        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
    }
})


app.delete('/myserver/deleteCoupon/:id', async(req, res, next) => {
    try {
        let response = await axios.delete(`${SampleUrl}/delete/${req.params.id}`)
        res.status(200).json({ data: response.data })
        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: error })
    }
})


const PORT = process.env.PORT || 5000


app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })