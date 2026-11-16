import "dotenv/config";
import { Resend } from "resend";



const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationOTP = async (email, otp) => {
    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: "Verify your Swadion account",
        html: `
            <div style="font-family: Arial, sans-serif;">
                <h2>Welcome to Swadion!</h2>
                <p>Your email verification OTP is:</p>

                <h1 style="letter-spacing: 8px;">${otp}</h1>

                <p>This OTP expires in 5 minutes.</p>
                <p>Please do not share this code with anyone.</p>
            </div>
        `
    });
    if(error){
        throw new Error(error.message)
    }

    return data
}