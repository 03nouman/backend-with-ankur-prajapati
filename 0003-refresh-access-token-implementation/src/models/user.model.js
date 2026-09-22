import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: [3, "Name must be atleast 3 character long "],
    maxLength: [6, "Name must be atleast 6 character long"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    lowercase: true,
    trim: true,
  },
  passwordHash: {
    type: String,
    required: true,
    minLength: 6,
  },
  refreshToken: {
    type: String,
  },
});

const userModel = mongoose.model("users", userSchema);

export default userModel;
