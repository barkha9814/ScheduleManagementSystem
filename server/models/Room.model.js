const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        unique: true,
        trim: true,
    },
    roomName: {
        type: String,
        unique: false,
        trim: false,
    }
});

module.exports = mongoose.model("Room", RoomSchema);
