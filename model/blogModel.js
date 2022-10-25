const mongoose = require('mongoose');

const schema = mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    description:{
        type:String,
        required: true
    },
    tags:[{type:String}],
   
    timestamp: Date,
    body:{
        type:String,
        required: true
    }
})

module.exports = mongoose.model("blogRoutes", schema)