const UserModel = require("../models/User.model");
const RoomModel = require("../models/Room.model");

/**
 * middleware to convert userId to mongo _id.
 */
const userIdConverter = async (req, res, next) => {
    if (req.body.userId || req.query.userId || req.params.userId) {
        const userId = req.body.userId ? req.body.userId : (req.query.userId ? req.query.userId : req.params.userId);
        const user = await UserModel.findOne({userId: userId});
        if (user) {
            req.body.userId = user._id;
            req.query.userId = user._id;
            req.params.userId = user._id;
            req.body.user = userId;
            req.query.user = userId;
            req.params.user = userId;
        } else {
            req.body.userId = -1;
            req.query.userId = -1;
            req.params.userId = -1;
            req.body.user = -1;
            req.query.user = -1;
            req.params.user = -1;
        }
    }
    if (req.body.guestUsers) {
        const convertedGuestList = [];
        for (let i = 0; i < req.body.guestUsers.length; i++) {
            const user = await UserModel.findOne({userId: req.body.guestUsers[i]});
            if (!user) {
                convertedGuestList.push(-1);
            } else {
                convertedGuestList.push(user._id);
            }
        }
        req.body.guestUserIds = convertedGuestList;
    }
    next();
};

/**
 * middleware to convert roomId to mongo _id.
 */
const roomIdConverter = async (req, res, next) => {
    if (req.body.roomId || req.query.roomId || req.params.roomId) {
        const roomId = req.body.roomId ? req.body.roomId : (req.query.roomId ? req.query.roomId : req.params.roomId);
        const room = await RoomModel.findOne({roomId: roomId});
        if (room) {
            req.body.roomId = room._id;
            req.query.roomId = room._id;
            req.params.roomId = room._id;
        } else {
            req.body.roomId = -1;
            req.query.roomId = -1;
            req.params.roomId = -1;
        }
    }
    next();
}

module.exports = {
    userIdConverter,
    roomIdConverter,
};
