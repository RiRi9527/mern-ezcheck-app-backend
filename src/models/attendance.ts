import { ObjectId } from "mongodb";
import mongoose from "mongoose";

// const Sample = {
//   employee_id: "12345";
//   date: "2024-04-24";
//   schedule_start_time: "09:00";
//   schedule_end_time: "17:00";
//   check_ins: "09:00";
//   check_outs: "17:00";
//   temporarily_leave_returns: [
//     { leave_time: "10:30"; return_time: "10:45"; location: "Restroom" },
//     { leave_time: "14:30"; return_time: "14:45"; location: "Meeting Room" }
//   ];
// };

export interface AttendanceType extends Document {
  employee_id: ObjectId;
  date: Date;
  schedule_start_time: Date;
  schedule_end_time: Date;
  check_ins: Date;
  check_outs: Date;
  temporarily_leave_returns: Array<{
    leave_time: Date;
    return_time: Date;
    location: string;
  }>;
}

const attendanceSchema = new mongoose.Schema({
  employee_id: { type: String, required: true, unique: true },
  date: { type: Date, required: true, unique: true },
  schedule_start_time: { type: Date, required: true },
  schedule_end_time: { type: Date, required: true },
  check_ins: { type: Date, required: true },
  check_outs: { type: Date },
  temporarily_leave_returns: [
    {
      leave_time: { type: Date },
      return_time: { type: Date },
      location: { type: String },
    },
  ],
});

const Attendance = mongoose.model<AttendanceType>(
  "Attendance",
  attendanceSchema
);

export default Attendance;
