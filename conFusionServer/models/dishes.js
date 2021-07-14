const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;
var commentSchema = new Schema({
    "rating":{
        type:Number,
        min:1,
        max:5
    },
    "comment":{
        type:String,
        required:true
    },
    "author":{
        type:String,
        required:true
    }
});
var dishSchema = new Schema({
    "name":{
        type:String,
        required:true
    },
    "image":{
        type:String,
        required:true
    },
    "category":{
        type:String,
        required:true
    },
    "label":{
        type:String,
        default:""
    },
    "price":{
        type:Currency,
        min:0,
        required:true
    },
    "featured":{
        type:Boolean,
        default:false
    },    
    "designation":{
        type:String,
        required:true
    },
    "comments":[commentSchema]
},{
    "timestamps":true
})

var Dishes = mongoose.model('Dish',dishSchema);

module.exports = Dishes;