const express = require("express");

//importing controller functions
const {createUser, listUsers, getUser, deleteUser, updateUser} = require("../controllers/user.controller");

const router = express.Router();

router.route("/add-user").post(createUser);
router.route("/get-all-users").get(listUsers);
router.route("/:userId").get(getUser);
router.route("/:userId").put(updateUser);
router.route("/:userId").delete(deleteUser);


module.exports = router;
