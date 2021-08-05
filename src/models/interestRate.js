const mongoose = require('mongoose')

const Rates = mongoose.model('Rate', {
    name: {
        type: String,
        required: true,
    },
    rate: {
        type: Number,
        requires: true
    }
})

module.exports = Rates