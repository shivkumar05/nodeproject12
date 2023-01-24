const mongoose = require("mongoose");

const RecommendationSchema = new mongoose.Schema({
    anecdote_no: {
        type: Number,
        require: true
    },
    mesage: {
        type: String,
        require: true
    },
    audioFile: [{
        type: String,
        require: true
    }],
    audiolength: {
        type: String,
        require: true
    },
    createdat: {
        type: String,
        require: true
    },
    manual: {
        type: String,
        require: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Recommendation", RecommendationSchema)