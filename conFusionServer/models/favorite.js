const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Favorite = new Schema ({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    dishes:[    {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Dish'
    }]
});

module.exports = mongoose.model('Favorite',Favorite);