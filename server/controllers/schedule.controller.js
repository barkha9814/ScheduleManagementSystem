const asyncHandler = require("../utils/async");
const ScheduleModel = require("../models/Schedule.model");
const {
    checkUserAvailability,
    checkRoomAvailability,
    getAllMeetingsByUserId,
    getAllMeetingsByRoomId,
    reformatMeetings,
} = require("../utils/Helper");

//  @desc       create a meeting
//  @route      POST /api/v1/schedule
//  @access     Public
exports.createSchedule = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for creating new meeting'
    // #swagger.tags = ['Meeting']
    /* #swagger.parameters['body'] = {
                 in: 'body',
                 schema: { $ref: "#/definitions/schedule" }
          } */
    try {
        // guestUserIds is from middleware(userIdConverter)
        const {
            user,
            userId,
            roomId,
            meetingDate,
            startTime,
            endTime,
            guestUsers,
            guestUserIds,
        } = req.body;
        if (userId && roomId && meetingDate && startTime && endTime) {
            if (userId !== -1) {
                // checking if the roomId actually exists
                if (roomId !== -1) {
                    const formattedMeetingDate = new Date(meetingDate);
                    const formattedStartTime = new Date(meetingDate + "T" + startTime);
                    const formattedEndTime = new Date(meetingDate + "T" + endTime);
                    guestUserIds.push(userId);
                    guestUsers.push(user);
                    for (let i = 0; i < guestUserIds.length; i++) {
                        if (guestUserIds[i] === -1) {
                            return res.status(400).json({
                                success: false,
                                message: `User: ${guestUsers[i]} does not exist`,
                            });
                        }
                        const isAvailable = await checkUserAvailability(
                            guestUserIds[i],
                            formattedMeetingDate,
                            formattedStartTime,
                            formattedEndTime
                        );
                        if (!isAvailable) {
                            return res.status(400).json({
                                success: false,
                                message: `User: ${guestUsers[i]} is not available at this time`,
                            });
                        }
                    }

                    const isRoomAvailable = await checkRoomAvailability(
                        roomId,
                        formattedMeetingDate,
                        formattedStartTime,
                        formattedEndTime
                    );
                    if (!isRoomAvailable) {
                        return res.status(400).json({
                            success: false,
                            message: "The room is not empty in this time slot",
                        });
                    }


                    const schedule = await ScheduleModel({
                        hostUserId: userId,
                        guestUsers: guestUserIds,
                        roomId,
                        meetingDate: formattedMeetingDate,
                        startTime: formattedStartTime,
                        endTime: formattedEndTime,
                        offset: new Date().getTimezoneOffset(),
                    }).save();

                    // formatting the time with client time
                    const formattedMeeting = await reformatMeetings([schedule]);

                    res.status(200).json({
                        success: true,
                        data: formattedMeeting[0],
                    });

                } else {
                    return res.status(400).json({
                        success: false,
                        message: "No such roomId exists",
                    });
                }
            } else {
                return res.status(400).json({
                    success: false,
                    message: "Host User ID does not exist",
                });
            }
        } else {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide a hostUserId, roomId, meetingDate, startTime, endTime",
            });
        }
    } catch (err) {
        return next(err);
    }
});

//  @desc       list meeting schedule by user
//  @route      GET /api/v1/schedule/byUser
//  @access     Public
exports.listScheduleForUser = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for fetching all meetings by UserID'
    // #swagger.tags = ['Meeting']
    try {
        const {userId} = req.query;
        if (userId !== -1) {
            // Search meetings for guests and host
            const meetings = await getAllMeetingsByUserId(userId);

            // Format Meetings Object
            const formattedIdMeetings = await reformatMeetings(meetings);
            if (formattedIdMeetings) {
                res.status(200).json({
                    success: true,
                    data: formattedIdMeetings,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "No meetings found for this userId",
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: "The userId is invalid",
            });
        }
    } catch (err) {
        return next(err);
    }
});

//  @desc       list meeting schedule by roomId
//  @route      GET /api/v1/schedule/byRoom
//  @access     Public
exports.listScheduleForRoom = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for fetching all meetings by RoomID'
    // #swagger.tags = ['Meeting']
    try {
        const roomId = req.query.roomId;
        if (roomId !== -1) {
            // Search meetings for the Room
            const meetings = await getAllMeetingsByRoomId(roomId);

            // Format  meetings object
            const formattedIdMeetings = await reformatMeetings(meetings);

            if (formattedIdMeetings) {
                res.status(200).json({
                    success: true,
                    data: formattedIdMeetings,
                });
            } else {
                res.status(200).json({
                    success: false,
                    message: "No meetings found for this roomId",
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: "Invalid roomId",
            });
        }
    } catch (err) {
        return next(err);
    }
});
