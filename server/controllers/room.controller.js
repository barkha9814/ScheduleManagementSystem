const asyncHandler = require("../utils/async");
const RoomModel = require("../models/Room.model");
const ScheduleModel = require("../models/Schedule.model");
const {
    getAllMeetingsByRoomId,
} = require("../utils/Helper");


//  @desc       create single room
//  @route      POST /api/v1/rooms/add-room
//  @access     Public
exports.createRoom = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for creating new room'
    // #swagger.tags = ['Rooms']
    /* #swagger.parameters['body'] = {
                 in: 'body',
                 schema: { $ref: "#/definitions/room" }
          } */
    try {
        const room = await RoomModel({
            roomId: req.body.roomId,
            roomName: req.body.roomName,
        }).save();

        res.status(200).json({
            success: true,
            data: room,
        });
    } catch (err) {
        res.status(409).json({
            success: false,
            message: "Room exists, change roomId",
        });
        return next();
    }
});

//  @desc       list rooms
//  @route      get /api/v1/rooms/get-all-rooms
//  @access     Public

exports.listRooms = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for fetching all rooms'
    // #swagger.tags = ['Rooms']
    try {
        const roomList = await RoomModel.find().select(["-__v"]);
        res.status(200).json({
            success: true,
            data: roomList,
        });
    } catch (err) {
        return next(err);
    }
});


//  @desc       get One room
//  @route      get /api/v1/rooms/get-room
//  @access     Public
exports.getRoom = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for fetching a room by ID'
    // #swagger.tags = ['Rooms']
    try {
        const room = await RoomModel.findOne({
            roomId: req.params.roomId
        });
        if (room) {
            res.status(200).json({
                success: true,
                data: room,
            });
        } else {
            res.status(200).json({
                success: false,
                message: "No room found with ID: " + req.params.roomId,
            });
        }

    } catch (err) {
        return next(err);
    }
});

//  @desc       delete One room
//  @route      delete /api/v1/users/delete-room
//  @access     Public
exports.deleteRoom = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for deleting a room by ID'
    // #swagger.tags = ['Rooms']
    try {
        const room = await RoomModel.findOne({
            roomId: req.params.roomId
        });

        if (room) {
            const meetings = await getAllMeetingsByRoomId(room._id);

            for (let i = 0; i < meetings.length; i++) {
                const meetingID = meetings[i]._id;
                await ScheduleModel.deleteOne({
                    _id: meetingID
                });
            }
            await RoomModel.deleteOne({
                roomId: req.params.roomId
            });

            res.status(200).json({
                success: true,
                data: room,
            });
        } else {
            res.status(200).json({
                success: false,
                message: "No room found with ID: " + req.params.roomId,
            });
        }
    } catch (err) {
        return next(err);
    }
});

//  @desc       update single room
//  @route      PUT /api/v1/rooms/add-room
//  @access     Public
exports.updateRoom = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for Updating a room by ID'
    // #swagger.tags = ['Rooms']
    /* #swagger.parameters['body'] = {
                 in: 'body',
                 schema: { $ref: "#/definitions/updateRoom" }
          } */
    try {
        const res_data = await RoomModel.updateOne(
            {roomId: req.params.roomId},
            req.body
        );
        if (res_data.modifiedCount === 1) {
            const room = await RoomModel.findOne({
                roomId: req.params.roomId,
            });
            res.status(200).json({
                success: true,
                data: room,
            });
        } else if (res_data.matchedCount === 1) {
            const room = await RoomModel.findOne({
                userId: req.params.userId,
            });
            res.status(200).json({
                success: false,
                data: room,
                message: "Room found, record not modified."
            });
        } else {
            res.status(409).json({
                success: false,
                data: "No room found with ID: " + req.body.roomId,
            });
        }
    } catch (err) {
        return next()
    }
});
