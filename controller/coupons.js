const coupons = require('../model/coupons')
const path = require('path')
const fs = require("fs")
const mongodb = require("mongodb").MongoClient;
const csvtojson = require("csvtojson")
const XLSX = require('xlsx')
const fastcsv = require("fast-csv")
const excelToJson = require('convert-excel-to-json')


//COUPON CREATION

const createCoupon = async(req, res) => {
    try {
        let { offerName, couponCode } = req.body;

        const couponExist = await coupons.findOne({ $or: [{ offerName: offerName }, { couponCode: couponCode }] });
        if (couponExist) {
            return res.status(200).json({ message: "Coupon Already Exists" });
        } else {
            const Coupon = new coupons({
                offerName: req.body.offerName,
                couponCode: req.body.couponCode,
                startDate: req.body.startDate,
                endDate: req.body.endDate,
                discount: req.body.discount,
                amount: req.body.amount,
                status: req.body.status
            });

            const couponCreation = await Coupon;
            if (couponCreation) {
                await couponCreation.save();
                return res.status(200).json({ message: "Coupon Created Successfully :)", data: couponCreation });
            }
        }
    } catch (err) {
        console.log(err);
    }
}


let url = "mongodb://localhost:27017/";

const stream = function(req, res, next) {
    let stream = fs.createReadStream("Coupon Data.csv");
    let csvData = [];
    let csvStream = fastcsv
        .parse()
        .on("data", function(data) {
            csvData.push({
                offerName: data[0],
                couponCode: data[1],
                startDate: data[2],
                endDate: data[3],
                discount: data[4],
                amount: data[5],
                status: data[6]
            });
        })
        .on("end", function() {
            // remove the first line: header
            csvData.shift();

            console.log(csvData);


            mongodb.connect(
                url, { useNewUrlParser: true, useUnifiedTopology: true },
                (err, client) => {
                    if (err) throw err;

                    client.db("coupons").collection("coupons").insertMany(csvData, (err, res) => {
                        if (err) throw err;
                        console.log(`Rows_Inserted: ${res.insertedCount}`)
                        client.close();
                    });
                }
            );
        });
    res.json({ message: "Data Imported Successfully" });
    stream.pipe(csvStream);
}


const updateCoupon = async(req, res) => {
    try {
        const couponExist = await coupons.findOne({ couponCode: req.body.couponCode, _id: { $ne: req.params.id } });
        if (couponExist) {
            return res.status(200).json({ message: "Coupon Details Already Exists" });
        } else {
            const updated_coupon = await coupons.findByIdAndUpdate({ _id: req.params.id }, {
                $set: {
                    offerName: req.body.offerName,
                    couponCode: req.body.couponCode,
                    startDate: req.body.startDate,
                    endDate: req.body.endDate,
                    discount: req.body.discount,
                    amount: req.body.amount,
                    status: req.body.status
                }
            }, { new: true });
            return res.status(200).json({ message: 'Coupon details updated', data: updated_coupon });
        }
    } catch (err) {
        console.log('Details not found!!')
    }
}


const deleteCoupon = async(req, res) => {
    try {
        await coupons.findByIdAndDelete(req.params.id)
        if (!req.params.id) {
            return res.status(404).json({ error: "Coupon not found" })
        }
        return res.status(200).json({ message: "Coupon Deleted" })
    } catch (err) {
        console.log(err)
    }
}


const getCoupon = async(req, res) => {
    try {
        const get_coupon = await coupons.findById(req.params.id)
        if (!req.params.id) {
            return res.status(404).json({ error: "Coupon not found" })
        }
        return res.status(200).json(get_coupon)
    } catch (err) {
        console.log(err)
    }
}


const getCouponByUserId = async(req, res) => {
    try {
        const { userId } = req.params
        let response = await axios.get(`${Url}/${userId}`)
        const get_coupon = await coupons.find({ userId })
        return res.status(200).json({ coupon: get_coupon, data: response.data })

    } catch (err) {
        console.log(err)
    }
}


const getCouponByUserId2 = async(req, res) => {
    try {
        const { userId } = req.params
        let get_coupon = await coupons.find({ userId })
        let response = await axios.get(`${SampleUrl}/${userId}`)
        for (let i = 0; i < get_coupon.length; i++) {
            if (get_coupon[i]) {
                get_coupon[i].name = response.data.user_name
                get_coupon[i].phoneNo = response.data.phone_no
                get_coupon[i].emailId = response.data.email
            }
        }
        res.status(200).send({ "Coupons": get_coupon })
    } catch (err) {
        console.log(err)
    }
}


const searchCoupon = async(req, res) => {
    const { search, status } = req.query

    const page = parseInt(req.query.page)
    const limit = parseInt(req.query.limit)
    const start = (page - 1) * limit
    const end = page * limit

    const results = {}

    if (start > 0) {
        results.previous = {
            page: page - 1
        }
    }

    results.couponData = await coupons.find({
        $and: [({
            $or: [
                { offerName: { $regex: `${search}`, $options: "i" } },
                { couponCode: { $regex: `${search}`, $options: "i" } }
            ]
        }), { status: { $in: [status] } }]
    }).sort({ offerName: 1 }).limit(limit).skip(start).exec()

    if (end < await coupons.countDocuments().exec()) {
        results.next = {
            page: page + 1
        }
    }
    if (!results.couponData) {
        return res.status(404).json({ error: "No results found" })
    }
    return res.status(200).json(results)
}



module.exports = { createCoupon, getCoupon, updateCoupon, deleteCoupon, searchCoupon, getCouponByUserId, getCouponByUserId2 }
