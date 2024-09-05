const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    Hall_Name: {
        type: String,
        required: true
    },
    Capacity: {
        type: Number,
        required: true
    },
    Location: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Hall_Type: {
        type: String,
        required: true,
        enum: ['Banquet', 'Conference', 'Meeting Room', 'Ballroom']
    },
    Photos: {
        data: Buffer,
        contentType: String
    },
});

module.exports = mongoose.model("UserModel", userSchema);