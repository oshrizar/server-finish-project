// Upload.js
const mongoose = require("mongoose");

const UploadSchema = new mongoose.Schema({
  data: Buffer,
  contentType: {
    type: String,
    enum: ["image/png", "image/jpeg", "image/jpg", "image/gif"],
  },
});

module.exports = { UploadSchema };
