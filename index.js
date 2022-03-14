const path = require('path');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use('/api/3dmodel', require('./routes/3DModelRouter'))

const URI = process.env.MONGO_URL
mongoose.connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, (err) => {
    if (err) throw err;
    console.log('Connected to MongoDB.');
})

app.get('/', (req, res) => {
    res.json({ msg: "ON AIR" })
})

const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Server is runnning on port ${port}`);
})