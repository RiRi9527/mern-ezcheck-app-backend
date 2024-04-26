import { ObjectId } from "mongodb";
import mongoose, { Document } from "mongoose";

export interface Schedule_start_end extends Document {
  _id: ObjectId;
  schedule_start: Date;
  schedule_end: Date;
}

export interface Check_ins_outs extends Document {
  _id: ObjectId;
  check_in: Date;
  check_out: Date;
}

export interface Temporarily_leaves_returns extends Document {
  _id: ObjectId;
  temporarily_leave: Date;
  temporarily_return: Date;
}

export interface AttendanceType extends Document {
  _id: ObjectId;
  date: Date;
  schedule_start_end: Schedule_start_end[];
  check_ins_outs: Check_ins_outs[];
  temporarily_leaves_returns: Temporarily_leaves_returns[];
}

// This function creates and returns a model for a specific employee
export function createAttendanceModel(
  employeeId: string
): mongoose.Model<AttendanceType> {
  const schedule_start_end_Schema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    schedule_start: { type: Date },
    schedule_end: { type: Date },
  });

  const check_ins_outs_Schema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    check_in: { type: Date },
    check_out: { type: Date },
  });

  const temporarily_leaves_returns_Schema = new mongoose.Schema({
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      default: () => new mongoose.Types.ObjectId(),
    },
    temporarily_leave: { type: Date },
    temporarily_return: { type: Date },
  });

  const attendanceSchema = new mongoose.Schema({
    date: { type: Date, required: true }, // Date
    schedule_start_end: [schedule_start_end_Schema],
    check_ins_outs: [check_ins_outs_Schema],
    temporarily_leaves_returns: [temporarily_leaves_returns_Schema],
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
