const mongoose = require("mongoose");

const PackageModel = new mongoose.Schema(
  {
    codename: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Package = mongoose.model("Package", PackageModel);

module.exports = Package;
