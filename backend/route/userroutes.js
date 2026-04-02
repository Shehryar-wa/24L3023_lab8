const express = require("express");
const router = express.Router();

const { getUsers , getExperience, verifyUser, AddExperience , deleteExperience , updateExperience} = require("../controller/usercontroller");

router.get("/users",getUsers);

router.post("/experience", getExperience);

router.post("/login", verifyUser);

router.post("/AddExperience" , AddExperience);

router.post("/deleteExperience", deleteExperience);

router.post("/updateExperience", updateExperience);

module.exports = router;