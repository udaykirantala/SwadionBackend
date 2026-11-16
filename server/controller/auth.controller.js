import User from "../model/User.model.js";
import { sendVerificationOTP } from "../services/emailService.js";
import { generateOTP, getOTPExpiry, hashOTP } from "../utils/generateOTP.js";
import { generateToken } from "../utils/generateToken.js";


export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validate required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Name, email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // 2. Check existing user
        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        // 3. If user already exists
        if (existingUser) {

            // Already verified
            if (existingUser.isEmailVerified) {
                return res.status(409).json({
                    success: false,
                    message: "Email is already registered"
                });
            }

            // Existing but not verified: resend a new OTP
            const otp = generateOTP();

            existingUser.otpHash = hashOTP(otp);
            existingUser.otpExpiresAt = getOTPExpiry();
            existingUser.otpAttempts = 0;
            existingUser.otpLastSentAt = new Date();

            await existingUser.save();

            await sendVerificationOTP(normalizedEmail, otp);

            return res.status(200).json({
                success: true,
                message: "Your account is not verified. A new OTP has been sent to your email."
            });
        }

        // 4. Generate OTP for new user
        const otp = generateOTP();

        // 5. Create new user
        const user = new User({
            name: name.trim(),
            email: normalizedEmail,
            password,
            otpHash: hashOTP(otp),
            otpExpiresAt: getOTPExpiry(),
            otpAttempts: 0,
            otpLastSentAt: new Date()
        });

        await user.save();

        // 6. Send OTP
        await sendVerificationOTP(normalizedEmail, otp);

        return res.status(201).json({
            success: true,
            message: "Registration successful. Please verify your email."
        });

    } catch (error) {
        console.error("Registration error:", error);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        return res.status(500).json({
            success: false,
            message: "Something went wrong during registration"
        });
    }
};


export const verifyEmailOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({
                success: false,
                message: "Email and OTP are required"
            });
        }

        const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+otpHash +otpExpiresAt +otpAttempts");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }
        if (!user.otpHash || !user.otpExpiresAt) {
            return res.status(400).json({
                success: false,
                message: "No active OTP found. Please request a new OTP."
            });
        }

        if (user.otpExpiresAt < new Date()) {
            return res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new OTP."
            });
        }

        if (user.otpAttempts >= 5) {
            return res.status(429).json({
                success: false,
                message: "Too many incorrect attempts. Please request a new OTP."
            });
        }

        const submittedOTPHash = hashOTP(otp.trim());

        if (submittedOTPHash !== user.otpHash) {
            user.otpAttempts += 1;
            await user.save();

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        user.isEmailVerified = true;
        user.otpHash = undefined;
        user.otpExpiresAt = undefined;
        user.otpAttempts = 0;
        user.otpLastSentAt = undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message: "Email verified successfully. You can now log in."
        });

    } catch (error) {
        console.error("OTP verification error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during email verification"
        });
    }
}

export const resendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        }).select("+otpHash +otpExpiresAt +otpAttempts +otpLastSentAt +otpResendCount");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.isEmailVerified) {
            return res.status(400).json({
                success: false,
                message: "Email is already verified"
            });
        }

        // 60-second resend cooldown
        const cooldown = 60 * 1000;

        if (
            user.otpLastSentAt &&
            Date.now() - user.otpLastSentAt.getTime() < cooldown
        ) {
            return res.status(429).json({
                success: false,
                message: "Please wait before requesting another OTP"
            });
        }

        // Maximum 5 resends
        if (user.otpResendCount >= 5) {
            return res.status(429).json({
                success: false,
                message: "Maximum OTP resend limit reached"
            });
        }

        const otp = generateOTP();

        user.otpHash = hashOTP(otp);
        user.otpExpiresAt = getOTPExpiry();
        user.otpAttempts = 0;
        user.otpResendCount += 1;
        user.otpLastSentAt = new Date();

        await user.save();

        await sendVerificationOTP(normalizedEmail, otp);

        return res.status(200).json({
            success: true,
            message: "A new OTP has been sent to your email"
        });

    } catch (error) {
        console.error("Resend OTP error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to resend OTP"
        });
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" })
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = await User.findOne({ email: normalizedEmail }).select("+password")
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password" })
        }
        if (!user.isActive) {
            return res.status(403).json({ success: flase, message: "Your account is disabled" })
        }
        if (!user.isEmailVerified) {
            return res.status(403).josn({ success: flase, message: "Please verify your email before logging in" })
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = generateToken(user._id);
        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong during login"
        });
    }
}

export const getMyProfile = async (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Profile fetched successfully",
        user: {
            id: req.user._id,
            name: req.user.name,
            email: req.user.email,
            role: req.user.role
        }
    });
};