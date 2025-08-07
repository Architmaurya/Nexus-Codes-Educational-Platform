// Importing necessary modules and packages
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config(); // ✅ Load .env at the top

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const cors = require("cors");

// Custom modules
const userRoutes = require("./routes/user");
const profileRoutes = require("./routes/profile");
const courseRoutes = require("./routes/Course");
const paymentRoutes = require("./routes/Payments");
const contactUsRoute = require("./routes/Contact");
const database = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");

// ✅ PORT binding for Render or local dev
const PORT = process.env.PORT || 3000;

// ✅ Connect to database and cloudinary
database.connect();
cloudinaryConnect();

// ✅ Middlewares
app.use(express.json());
app.use(cookieParser());

// ✅ CORS setup — allow frontend from Vercel
app.use(cors({
  origin: 'https://nexus-codes-educational-platform.vercel.app',
  credentials: true,
}));

// ✅ File upload
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: "/tmp/",
}));

// ✅ Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/course", courseRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/reach", contactUsRoute);

// ✅ Test route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

// ✅ Start server — required by Render to bind to process.env.PORT
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
