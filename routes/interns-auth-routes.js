const express = require("express");
const router = express.Router();

const {
  registerInternController,
  checkEmailAvailability,
  loginInternController,
  checkPhoneAvailability,
} = require("../controllers/interns-auth-controller");

router.post("/register", registerInternController);
router.post("/login", loginInternController);
router.get("/check-email", checkEmailAvailability);
router.get("/check-phone", checkPhoneAvailability);

module.exports = router;
