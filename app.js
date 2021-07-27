require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const helmet = require("helmet");

//Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

const app = express();

//database connection
mongoose
  .connect(process.env.Mongo_Uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Database Connected....");
  })
  .catch((err) => {
    console.log(err);
  });

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(helmet());
app.use(express.json({ extented: false }));

//My routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  return res.json({
    message: "Welcome to my blog",
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
