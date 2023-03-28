const express = require("express");
const {userIdConverter, roomIdConverter} = require('../utils/IdConverter');

//importing controller functions
const { createSchedule, listScheduleForUser, listScheduleForRoom } = require("../controllers/schedule.controller");

const router = express.Router();

router.use(userIdConverter);
router.use(roomIdConverter);
router.route("/create-meeting").post(createSchedule);
router.route("/get-meetings/user").get(listScheduleForUser);
router.route("/get-meetings/room").get(listScheduleForRoom);

module.exports = router;
