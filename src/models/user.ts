import mongoose from "mongoose";

export type UserType = {
  _id: string;
  userName: string;
  password: string;
  firstName: string;
  lastName: string;
  position: string;
  hourlyWage: number;
  working: boolean;
  imageUrl?: string;
  status: "offline" | "online" | "busy";
  schedule?: {
    monday?: { checkIn: string; checkOut: string };
    tuesday?: { checkIn: string; checkOut: string };
    wednesday?: { checkIn: string; checkOut: string };
    thursday?: { checkIn: string; checkOut: string };
    friday?: { checkIn: string; checkOut: string };
    saturday?: { checkIn: string; checkOut: string };
    sunday?: { checkIn: string; checkOut: string };
  };
};

// Define the sub-schema for the schedule
const dayScheduleSchema = new mongoose.Schema(
  {
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
  },
  { _id: false }
);

const scheduleSchema = new mongoose.Schema(
  {
    monday: { type: dayScheduleSchema },
    tuesday: { type: dayScheduleSchema },
    wednesday: { type: dayScheduleSchema },
    thursday: { type: dayScheduleSchema },
    friday: { type: dayScheduleSchema },
    saturday: { type: dayScheduleSchema },
    sunday: { type: dayScheduleSchema },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  position: { type: String, required: true },
  hourlyWage: { type: Number, required: true },
  working: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ["offline", "online", "busy"],
    required: true,
    default: "offline",
  },

  imageUrl: { type: String },
  schedule: { type: scheduleSchema },
});

const User = mongoose.model<UserType>("User", userSchema);

export default User;
