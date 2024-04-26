import { ObjectId } from "mongodb";
import mongoose, { Document } from "mongoose";

export interface AttendanceType extends Document {
  date: Date;
  schedule_start_time: Date[];
  schedule_end_time: Date[];
  check_ins: Date[];
  check_outs: Date[];
  temporarily_leave_returns: Array<{
    leave_time: Date;
    return_time: Date;
    location: string;
  }>;
}

// This function creates and returns a model for a specific employee
export function createAttendanceModel(
  employeeId: string
): mongoose.Model<AttendanceType> {
  const attendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true }, // Date
    schedule_start_time: [{ type: Date, required: true }], // Scheduled start time
    schedule_end_time: [{ type: Date, required: true }], // Scheduled end time
    check_ins: [{ type: Date }], // Multiple check-in times
    check_outs: [{ type: Date }], // Multiple check-out times
    temporarily_leave_returns: [
      {
        leave_time: { type: Date }, // Leave time
        return_time: { type: Date }, // Return time
        location: { type: String }, // Location
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
