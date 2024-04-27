import mongoose, { Document } from "mongoose";

export interface BigReactCalendarEvent extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
}

export function createBigReactCalendarEventModel(
  employeeId: string
): mongoose.Model<BigReactCalendarEvent> {
  const attendanceSchema = new mongoose.Schema({
    title: { type: String },
    startTime: { type: Date },
    endTime: { type: Date },
  });

  // Create model with unique collection name based on employeeId
  return mongoose.model<BigReactCalendarEvent>(
    `BigReactCalendarEvents_${employeeId}`,
    attendanceSchema
  );
}

export default createBigReactCalendarEventModel;
