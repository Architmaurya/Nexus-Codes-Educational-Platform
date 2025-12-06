const bcrypt = require("bcrypt");
const User = require("../models/User");
const OTP = require("../models/OTP");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { mailSender } = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
const Profile = require("../models/Profile");
require("dotenv").config();

// -----------------------------
// SIGNUP (REGISTER USER)
// -----------------------------
exports.signup = async (req, res) => {
  console.log("📩 SIGNUP Request Received:", req.body);

  try {
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // Check missing fields
    if (!firstName || !lastName || !email || !password || !confirmPassword || !otp) {
      console.log("❌ Missing Signup Fields");
      return res.status(403).json({ success: false, message: "All Fields are required" });
    }

    // Password mismatch
    if (password !== confirmPassword) {
      console.log("❌ Passwords do not match");
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("❌ User Already Exists:", email);
      return res.status(400).json({
        success: false,
        message: "User already exists. Please login.",
      });
    }

    // Find OTP
    const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
    console.log("🔍 OTP Lookup:", response);

    if (response.length === 0 || otp !== response[0].otp) {
      console.log("❌ Invalid OTP");
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed");

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    const approved = accountType === "Instructor" ? false : true;

    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: hashedPassword,
      accountType,
      approved,
      additionalDetails: profileDetails._id,
      image: "",
    });

    console.log("✅ User Created:", user.email);

    return res.status(200).json({
      success: true,
      user,
      message: "User registered successfully",
    });

  } catch (error) {
    console.error("❌ SIGNUP ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Signup failed. Try again later.",
    });
  }
};

// -----------------------------
// LOGIN
// -----------------------------
exports.login = async (req, res) => {
  console.log("➡ LOGIN Request:", req.body);

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      console.log("❌ Missing fields for login");
      return res.status(400).json({
        success: false,
        message: "Please fill all fields",
      });
    }

    const user = await User.findOne({ email }).populate("additionalDetails");

    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({
        success: false,
        message: "User not registered",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      console.log("❌ Wrong password");
      return res.status(401).json({
        success: false,
        message: "Incorrect password",
      });
    }

    const token = jwt.sign(
      { email: user.email, id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 3 * 86400000),
      httpOnly: true,
    };

    res.cookie("token", token, options).status(200).json({
      success: true,
      token,
      user,
      message: "Login successful",
    });

  } catch (error) {
    console.error("❌ LOGIN ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// -----------------------------
// SEND OTP
// -----------------------------
exports.sendotp = async (req, res) => {
  console.log("📩 SEND OTP Request:", req.body);

  try {
    const { email } = req.body;

    const checkUserPresent = await User.findOne({ email });
    if (checkUserPresent) {
      console.log("❌ Email already registered:", email);
      return res.status(401).json({
        success: false,
        message: "User already registered",
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    console.log("🔢 Generated OTP:", otp);

    await OTP.create({ email, otp });
    console.log("📝 OTP saved to DB");

    await mailSender(email, "Your OTP Code", `<h1>Your OTP is: ${otp}</h1>`);
    console.log("📧 OTP Email Sent to:", email);

    res.status(200).json({
      success: true,
      message: "OTP Sent Successfully",
    });

  } catch (error) {
    console.error("❌ SEND OTP ERROR:", error.message);
    return res.status(500).json({ success: false, error: error.message });
  }
};

// -----------------------------
// CHANGE PASSWORD
// -----------------------------
exports.changePassword = async (req, res) => {
  console.log("🔄 CHANGE PASSWORD Request");

  try {
    const userDetails = await User.findById(req.user.id);

    const { oldPassword, newPassword } = req.body;

    const isPasswordMatch = await bcrypt.compare(oldPassword, userDetails.password);

    if (!isPasswordMatch) {
      console.log("❌ Old password incorrect");
      return res.status(401).json({
        success: false,
        message: "Incorrect old password",
      });
    }

    const encryptedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(
      req.user.id,
      { password: encryptedPassword },
      { new: true }
    );

    console.log("🔐 Password updated in DB");

    await mailSender(
      userDetails.email,
      "Password Updated",
      passwordUpdated(userDetails.email, "Your password was updated")
    );

    console.log("📧 Password update email sent");

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("❌ CHANGE PASSWORD ERROR:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error updating password",
    });
  }
};
