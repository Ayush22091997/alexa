const mongoose = require('mongoose')

const Notifications = mongoose.model('Payments', {
    name:{
        type:String,
        required:true
    },
    dueDate:{
        type:Date,
        required:true
    },
    paymentStatus:{
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