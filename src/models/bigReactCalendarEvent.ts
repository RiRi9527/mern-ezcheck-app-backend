// import mongoose, { Document } from "mongoose";

// export interface BigReactCalendarEvent extends Document {
//   title: string;
//   startTime: string;
//   endTime: string;
// }

// export const createBigReactCalendarEventModel = (
//   employeeId: string
// ): mongoose.Model<BigReactCalendarEvent> => {
//   const attendanceSchema = new mongoose.Schema({
//     title: { type: String },
//     startTime: { type: String },
//     endTime: { type: String },
//   });

//   // Create model with unique collection name based on employeeId
//   return mongoose.model<BigReactCalendarEvent>(
//     `BigReactCalendarEvents_${employeeId}`,
//     attendanceSchema
//   );
// };

// export default createBigReactCalendarEventModel;

import mongoose, { Document, Model } from "mongoose";

export interface BigReactCalendarEvent extends Document {
  title: string;
  start: string;
  end: string;
}

const BigReactCalendarEventModelMap: {
  [key: string]: Model<BigReactCalendarEvent>;
} = {};

export const createBigReactCalendarEventModel = (
  employeeId: string
): Model<BigReactCalendarEvent> => {
  const modelName = `BigReactCalendarEvents_${employeeId}`;

  // If the model already exists, return it directly
  if (BigReactCalendarEventModelMap[modelName]) {
    return BigReactCalendarEventModelMap[modelName];
  }

  const attendanceSchema = new mongoose.Schema({
    title: { type: String, require: true, index: true },
    start: { type: String },
    end: { type: String },
  });

  // Create a model and store it in a model map
  const model = mongoose.model<BigReactCalendarEvent>(
    modelName,
    attendanceSchema
  );
  BigReactCalendarEventModelMap[modelName] = model;

  return model;
};

export default createBigReactCalendarEventModel;
