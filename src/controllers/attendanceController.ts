import { Request, Response } from "express";
import Attendance from "../models/attendance";
import createAttendanceModel from "../models/attendanceByUserId";

const createAttendance = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.userParamsId;
    const AttendanceSchema = createAttendanceModel(userIdParam);

    const existingAttendance = await AttendanceSchema.findOne({
      date: req.body.date,
    });

    if (existingAttendance) {
      existingAttendance.schedule_start_time.push(req.body.schedule_start_time);
      existingAttendance.schedule_end_time.push(req.body.schedule_end_time);
      existingAttendance.check_ins.push(req.body.check_in_time);
      existingAttendance.check_outs.push(req.body.check_out_time);
      existingAttendance.temporarily_leave_returns.push({
        leave_time: req.body.leave_time,
        return_time: req.body.return_time,
        location: req.body.location,
      });
      await existingAttendance.save();
      return res.sendStatus(200);
    } else {
      const attendance = new AttendanceSchema(req.body);
      await attendance.save();
      return res.sendStatus(200);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error creating attendance` });
  }
};

export default {
  createAttendance,
};
