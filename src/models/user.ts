import mongoose from "mongoose";

export type UserType = {
  _id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  position: string;
  hourlyWage: number;
  isAdmin: boolean;
  imageUrl?: string;
};

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: { type: String, required: true },
  hourlyWage: { type: Number, required: true },
  isAdmin: { type: Boolean, default: false },
  imageUrl: { type: String },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
