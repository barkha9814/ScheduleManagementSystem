const express = require("express");

//importing controller functions
const {createRoom, listRooms, getRoom, deleteRoom, updateRoom} = require("../controllers/room.controller");
// const {updateUser} = require("../controllers/user.controller");

const router = express.Router();

router.route("/add-room").post(createRoom);
router.route("/get-all-rooms").get(listRooms);
router.route("/:roomId").get(getRoom);
router.route("/:roomId").put(updateRoom);
router.route("/:roomId").delete(deleteRoom);

module.exports = router;
