import { ObjectId } from "mongodb";
import mongoose, { Document } from "mongoose";

export interface AttendanceType extends Document {
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

// This function creates and returns a model for a specific employee
export function createAttendanceModel(
  employeeId: ObjectId
): mongoose.Model<AttendanceType> {
  const attendanceSchema = new mongoose.Schema({
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

  // Append employee_id condition to the schema
  attendanceSchema.add({
    employee_id: { type: String, required: true, default: employeeId },
  });

  // Create model with unique collection name based on employeeId
  return mongoose.model<AttendanceType>(
    `Attendance_${employeeId}`,
    attendanceSchema
  );
}

export default createAttendanceModel;
