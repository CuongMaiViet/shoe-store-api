require("dotenv").config();
const mongoose = require("mongoose");

const URI = process.env.MONGODB_URI;
mongoose.connect(
  URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("Connected to MongoDB.");
  }
);
