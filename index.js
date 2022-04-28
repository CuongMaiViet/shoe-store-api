const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./config/db");

const routes = require('./routes')
app.use('/api', routes)


app.get("/", (req, res) => {
  res.json({ msg: "ON AIR" });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is runnning on port ${port}`);
});



