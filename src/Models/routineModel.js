const mongoose = require("mongoose");

const drillSchema = new mongoose.Schema({
    drills: {
        type: String,
        require: true
    },
    date: {
        type: String,
        require: true
    },
    time: {
        type: String,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model("routine", drillSchema)