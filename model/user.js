const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    user_name: { type: String },

    phone_no: { type: Number },

    email: { type: String, unique: true, lowercase: true },

    password: { type: String },

    cpassword: { type: String, required: true }
}, { timestamps: true })

const user = mongoose.model('user', userSchema)
module.exports = user