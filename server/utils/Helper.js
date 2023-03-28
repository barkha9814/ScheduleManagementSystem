// const mongoose = require("mongoose");
const ScheduleModel = require("../models/Schedule.model");
const UserModel = require("../models/User.model");
const RoomModel = require("../models/Room.model");

const checkUserAvailability = async (
    userId,
    formattedMeetingDate,
    formattedStartTime,
    formattedEndTime
) => {
    const Query = [
        {
            $match: {
                hostUserId: userId,
                meetingDate: formattedMeetingDate,
                $or: [
                    {
                        startTime: {
                            $lte: formattedStartTime,
                        },
                        endTime: {
                            $gte: formattedStartTime,
                        },
                    },
                    {
                        startTime: {
                            $lte: formattedEndTime,
                        },
                        endTime: {
                            $gte: formattedEndTime,
                        },
                    },
                ],
            },
        },
    ];

    const clashes = await ScheduleModel.aggregate(Query);

    return clashes.length === 0;
};

const checkRoomAvailability = async (
    roomId,
    formattedMeetingDate,
    formattedStartTime,
    formattedEndTime
) => {
    const Query = [
        {
            $match: {
                roomId: roomId,
                meetingDate: formattedMeetingDate,
                $or: [
                    {
                        startTime: {
                            $lte: formattedStartTime,
                        },
                        endTime: {
                            $gte: formattedStartTime,
                        },
                    },
                    {
                        startTime: {
                            $lte: formattedEndTime,
                        },
                        endTime: {
                            $gte: formattedEndTime,
                        },
                    },
                ],
            },
        },
    ];

    const clashes = await ScheduleModel.aggregate(Query);
    return clashes.length === 0;
};


/**
 * Refactoring the timezone for the client
 * https://www.mongodb.com/docs/v3.2/tutorial/model-time-data/
 */

const formatScheduleDates = (meeting) => {
    meeting.meetingDate = new Date(
        meeting.meetingDate.getTime() - meeting.offset * 60000
    );
    meeting.startTime = new Date(
        meeting.startTime.getTime() - meeting.offset * 60000
    );
    meeting.endTime = new Date(
        meeting.endTime.getTime() - meeting.offset * 60000
    );

    return meeting;
};

const formatIds = async (meeting) => {
    /**
     * Creating a new object newMeeting, as meeting's hostUserId can only hold ObjectId type,
     * hostUser.userId is of type string.
     * meeting is a mongo object type wih multiple hidden values.
     * meeting._doc is the object we want.
     */
    const newMeeting = meeting._doc;
    const hostUser = await UserModel.findById(meeting.hostUserId);
    const room = await RoomModel.findById(meeting.roomId);
    newMeeting.hostUserId = hostUser.userId;
    newMeeting.roomId = room.roomId;

    const guestList = [];
    for (let i = 0; i < newMeeting.guestUsers.length; i++) {
        const guest = await UserModel.findById(newMeeting.guestUsers[i]);
        guestList.push(guest.userId);
    }
    newMeeting.guestUsers = guestList;

    return newMeeting;
};

const getAllMeetingsByUserId = async (userId) => {
    return ScheduleModel.find({
        $or: [
            {
                hostUserId: userId,
            },
            {
                guestUsers: {$in: [userId]},
            },
        ],
    }).sort("meetingDate startTime");
}

const getAllMeetingsByRoomId = async (roomId) => {
    return ScheduleModel.find({
        roomId: roomId,
    }).sort("meetingDate startTime");
}

const reformatMeetings = async (meetings) => {
    /**
     * Format dates
     */
    const formattedDateMeetings = meetings.map((meeting) =>
        formatScheduleDates(meeting)
    );
    /**
     * Format ids
     */
    const formattedIdMeetings = [];
    for (let i = 0; i < formattedDateMeetings.length; i++) {
        const meeting = await formatIds(formattedDateMeetings[i]);
        formattedIdMeetings.push(meeting);
    }
    return formattedIdMeetings;
}



module.exports = {
    checkUserAvailability,
    checkRoomAvailability,
    formatScheduleDates,
    formatIds,
    // checkUserAndRoomAvailability,
    getAllMeetingsByUserId,
    getAllMeetingsByRoomId,
    reformatMeetings,
};
