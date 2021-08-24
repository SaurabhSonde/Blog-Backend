const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const blogSchema = new mongoose.Schema(
  {
    userId: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subTitle: {
      type: String,
      required: true,
      trim: true,
    },
    markdown: {
      type: String,
      required: true,
    },
    sanitizedHtml: {
      type: String,
      required: true,
    },
    blogBody: {
      type: String,
      required: true,
      trim: true,
    },
    blogImage: {
      type: Buffer,
      contentType: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("Blog", blogSchema);
