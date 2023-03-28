const asyncHandler = require("../utils/async");
const UserModel = require("../models/User.model");
const ScheduleModel = require("../models/Schedule.model");
const {
    getAllMeetingsByUserId,
} = require("../utils/Helper");


//  @desc       create single user
//  @route      POST /api/v1/users/add-user
//  @access     Public
exports.createUser = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for creating new user'
    // #swagger.tags = ['User']
    /* #swagger.parameters['body'] = {
                 in: 'body',
                 schema: { $ref: "#/definitions/user" }
          } */
    try {
        const user = await UserModel({
            userId: req.body.userId,
            userName: req.body.userName,
            userEmail: req.body.userEmail,
        }).save();
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(409).json({
            success: false,
            message: "User exists, change UserId",
        });
        return next();
    }
});

//  @desc       list users
//  @route      get /api/v1/users/get-all-users
//  @access     Public

exports.listUsers = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for fetching all users'
    // #swagger.tags = ['User']
    try {
        const userList = await UserModel.find().select(["-__v"]);
        res.status(200).json({
            success: true,
            data: userList,
        });
    } catch (err) {
        return next(err);
    }
});


//  @desc       get One user
//  @route      get /api/v1/users/get-user
//  @access     Public
exports.getUser = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for fetching a user by ID'
    // #swagger.tags = ['User']
    try {
        const user = await UserModel.findOne({
            userId: req.params.userId
        });
        if (user) {
            res.status(200).json({
                success: true,
                data: user,
            });
        } else {
            res.status(200).json({
                success: false,
                message: "No user found with ID: " + req.params.userId,
            });
        }

    } catch (err) {
        return next(err);
    }
});

//  @desc       delete One user
//  @route      delete /api/v1/users/delete-user
//  @access     Public
exports.deleteUser = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for deleting a user by ID'
    // #swagger.tags = ['User']
    try {
        const user = await UserModel.findOne({
            userId: req.params.userId
        });

        if (user) {
            const meetings = await getAllMeetingsByUserId(user._id);

            for (let i = 0; i < meetings.length; i++) {
                const meetingID = meetings[i]._id;
                await ScheduleModel.deleteOne({
                    _id: meetingID
                });
            }
            await UserModel.deleteOne({
                userId: req.params.userId
            });

            res.status(200).json({
                success: true,
                data: user,
            });
        } else {
            res.status(200).json({
                success: false,
                message: "No user found with ID: " + req.params.userId,
            });
        }
    } catch (err) {
        return next(err);
    }
});

//  @desc       Update One user
//  @route      put /api/v1/users/delete-user
//  @access     Public

exports.updateUser = asyncHandler(async (req, res, next) => {
    // #swagger.description = 'Endpoint for Updating a user by ID'
    // #swagger.tags = ['User']
    /* #swagger.parameters['body'] = {
                 in: 'body',
                 schema: { $ref: "#/definitions/updateUser" }
          } */
    try {
        const res_data = await UserModel.updateOne(
            {userId: req.params.userId},
            req.body
        );
        if (res_data.modifiedCount === 1) {
            const user = await UserModel.findOne({
                userId: req.params.userId,
            });
            res.status(200).json({
                success: true,
                data: user,
            });
        } else if (res_data.matchedCount === 1) {
            const user = await UserModel.findOne({
                userId: req.params.userId,
            });
            res.status(200).json({
                success: false,
                data: user,
                message: "User found, record not modified."
            });
        } else {
            res.status(409).json({
                success: false,
                data: "No user found with ID: " + req.params.userId,
            });
        }
    } catch (err) {
        return next()
    }
});
