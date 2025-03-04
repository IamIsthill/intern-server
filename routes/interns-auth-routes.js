import express from 'express'
export const router = express.Router();
import {
  registerInternController,
  checkEmailAvailability,
  loginInternController,
  checkPhoneAvailability
} from '../controllers/interns-auth-controller.js';

router.post("/register", registerInternController);
router.post("/login", loginInternController);
router.get("/check-email", checkEmailAvailability);
router.get("/check-phone", checkPhoneAvailability);

