const mongoose = require('mongoose')

const Balance = mongoose.model('Balance', {
    currentBalance: {
        type: Number,
        required: true,
    },
    averageBalance: {
        type: Number,
        required: true
    },
    leftBalancePerMonth: {
        type: Number,
        required: true
    },
    currency:{
        type:String,
        default: "dollar"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Balance