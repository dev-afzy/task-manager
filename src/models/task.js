const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    owner: {
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'User'
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Task', schema)