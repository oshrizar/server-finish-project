const mongoose = require("mongoose");
const { UploadSchema } = require("./Upload");
const { REGEXES } = require("../../validation/helpersForValidations");

const DEFAULT_STRING_SCHEMA = {
  type: String,
  maxLength: 256,
  trim: true,
};

const DEFAULT_STRING_SCHEMA_REQUIRED = {
  ...DEFAULT_STRING_SCHEMA,
  minLength: 2,
  required: true,
};
const Email = {
  type: String,
  require: true,
  match: RegExp(REGEXES.EMAIL),
  lowercase: true,
  trim: true,
  unique: true,
};
const Created_At = {
  type: Date,
  default: Date.now,
};

const Name = new mongoose.Schema({
  first: DEFAULT_STRING_SCHEMA_REQUIRED,
  last: DEFAULT_STRING_SCHEMA_REQUIRED,
});

const Image = new mongoose.Schema({
  imageFile: UploadSchema,
  alt: DEFAULT_STRING_SCHEMA_REQUIRED,
});

module.exports = {
  Email,
  Created_At,
  Image,
  Name,
  DEFAULT_STRING_SCHEMA_REQUIRED,
};
