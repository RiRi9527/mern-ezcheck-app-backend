import { Request, Response } from "express";
import Attendance from "../models/attendance";

const createAttendance = async (req: Request, res: Response) => {
  try {
    const { employeeId, date } = req.body; // Assuming the request body contains employee ID and date

    // Find attendance record for a specific employee ID and date
    const existingAttendance = await Attendance.findOne({ employeeId, date });

    // If there is already an attendance record, return "already checkIn"
    if (existingAttendance) {
      return res.status(400).json({ message: "Already checkIn" });
    }

    // Otherwise, create a new attendance record
    const newAttendance = new Attendance(req.body);
    await newAttendance.save();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error creating attendance` });
  }
};

export default {
  createAttendance,
};
