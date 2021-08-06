const mongoose = require('mongoose')

const Notifications = mongoose.model('Notifications', {
    place:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    handled:{
        type:Boolean,
        default:false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports = Notifications