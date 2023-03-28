const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        trim: true,
    },
    userName: {
        type: String,
        unique: false,
        trim: false,
    },
    userEmail: {
        type: String,
        unique: false,
        trim: false,
    }
});

module.exports = mongoose.model("User", UserSchema);
