import e from "express"
import { getMyProfile, loginUser, registerUser, resendOTP, verifyEmailOTP } from "../controller/auth.controller.js";
import { protect } from "../middleware/auth.middleware.js";


const router =  e.Router();


router.post("/register",registerUser);
router.post("/verify-email",verifyEmailOTP);
router.post("/resend-otp",resendOTP);
router.post("/login", loginUser);
router.get("/profile", protect, getMyProfile);
export default router;