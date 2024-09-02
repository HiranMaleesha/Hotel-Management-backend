const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const userSchema = new Schema({
    Hall_Name:{
        type : String, //dataType
        required : true //validate
    },

    Capacity: {
        type: Number,
        required: true,       
    },

    Location: {
        type: String, // dataType
        required: true, // validation
        
    },

    Price:{
        type : Number, //dataType
        required : true //validate
    },

    Hall_Type: {
        type: String,
        required: true,
        enum: ['Banquet', 'Conference', 'Meeting Room','Ballroom',] // Define allowed hall type here
    },

    Photos:{
        type : String, //dataType
        required : true //validate
    },
});

module.exports = mongoose.model(
    "UserModel", //file name
    userSchema //function name
)