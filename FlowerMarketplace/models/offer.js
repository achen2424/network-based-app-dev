const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const offerSchema = new Schema({
    amount: {type: Number, required: [true, 'amount is required'], min: 0.01},
    status: {type: String, required: [true, 'status is required'], enum: ['pending', 'accepted', 'rejected'], default: 'pending'},
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
},
{timestamps: true}
);

module.exports = mongoose.model('Offer', offerSchema);