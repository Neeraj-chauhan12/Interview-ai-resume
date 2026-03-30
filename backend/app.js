const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDb = require("./src/dbconnection/dbConnection");
const authRoute = require("./src/routes/AuthRoute");
const InterviewRoute = require("./src/routes/InterviewRoutes");
const path = require("path");

const app = express();
require("dotenv").config();

const _dirname=path.resolve();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

// routes
app.use("/api/auth", authRoute);
app.use("/api/interview", InterviewRoute);



// database connection
connectDb();

// server is running here
const PORT = process.env.PORT || 5000;


// Serve static files from the React app and deploy the frontend
app.use(express.static(path.join(_dirname, '/frontend/dist')));
app.get((_, res) => {
  res.sendFile(path.join(_dirname, "frontend", "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
