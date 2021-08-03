const mongoose = require('mongoose')

const Transactions = mongoose.model('Transactions', {
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Transactions