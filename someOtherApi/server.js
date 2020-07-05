const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const cors = require("cors");

const authChecker = require("./middleware/authChecker");

app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

app.use("/", authChecker, async (req, res) => {
  // check for a token
  try {
    res.status(200).json({
      message: "Authenticated",
    });
  } catch (error) {
    res.status(400).json({
      error,
    });
  }
});

app.listen(3001, () => {
  console.log("Server running on port 3001");
});
