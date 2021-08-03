const mongoose = require('mongoose')

const Notifications = mongoose.model('Notifications', {
    notification: {
        type: String,
        required: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Notifications