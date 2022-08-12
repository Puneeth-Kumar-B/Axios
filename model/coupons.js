const mongoose = require('mongoose');

const { Schema } = mongoose;

const couponSchema = new Schema({
    offerName: { type: String },

    couponCode: { type: String, unique: true },

    startDate: { type: String },

    endDate: { type: String },

    discount: { type: Number },

    amount: { type: Number },

    status: { type: Boolean, default: false },

    uploadFile: { type: String },
    
    // userId: { type: String },

    userId: { type: Schema.Types.ObjectId, ref: 'user' },

    name: { type: String },

    phoneNo: { type: Number },

    emailId: { type: String }
});

module.exports = mongoose.model('coupons', couponSchema);
