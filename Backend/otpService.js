import twilio from "twilio";

const client = new twilio(
  "AC1d94801c96be02e3dbfb89bf9fc07a1c",
  "0f6bd803afdd143e6c564c7938a0200a"
);

// Temporary storage for OTPs (consider using a database for production)
const otpStorage = {}; // Store OTPs with phone numbers as keys

// Function to send OTP
export const sendOtp = async (phoneNumber, otp) => {
  const formattedPhoneNumber = phoneNumber.startsWith("0")
    ? `+94${phoneNumber.substring(1)}` // Format to E.164
    : phoneNumber; // Assuming it's already in E.164 format

  try {
    // Send OTP via SMS
    await client.messages.create({
      body: `Your OTP is: ${otp}`,
      from: "+13313214680", // Ensure this is a valid Twilio number
      to: '',
    });

    // Store the OTP temporarily
    otpStorage[formattedPhoneNumber] = otp; // Store with formatted number

    return true;
  } catch (error) {
    console.error("Error sending OTP:", error);
    return false;
  }
};

// Function to verify OTP
export const verifyOtp = (phoneNumber, otp) => {
  // Check if the OTP matches and remove it after verification
  const isValid = otpStorage[phoneNumber] === otp;
  delete otpStorage[phoneNumber]; // Clear OTP after use
  return isValid;
};
