import { Request, Response } from "express";
import createBigReactCalendarEventModel from "../models/bigReactCalendarEvent";
import User from "../models/user";

const getEvent = async (req: Request, res: Response) => {
  try {
    // Extract userIdParam from request parameters
    const { userIdParam, start: rangeStart, end: rangeEnd } = req.params;

    // Adding a 3-second delay
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // Create EventModel based on userIdParam
    const EventModel = createBigReactCalendarEventModel(userIdParam);

    // Retrieve all events that match the condition
    const events = await EventModel.find({
      start: { $gte: rangeStart, $lte: rangeEnd },
    });

    // Send the event data back to the client
    res.status(200).json(events);
  } catch (error) {
    // If an error occurs, send an appropriate error response
    console.log(error);
    res.status(500).json({ error: "Error fetch events" });
  }
};

const createEvent = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.userIdParam;
    const EventModel = createBigReactCalendarEventModel(userIdParam);
    const existingEvent = await EventModel.findById(req.body._id);
    if (existingEvent) {
      return res.status(409).json({ message: "Event already exists" });
    }
    const event = new EventModel(req.body);
    await event.save();
    return res.status(200).json(event);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Error Create Event` });
  }
};

const editEvent = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.userIdParam;
    const EventModel = createBigReactCalendarEventModel(userIdParam);
    const existingEvent = await EventModel.findById(req.body._id);

    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (req.body.title) {
      existingEvent.title = req.body.title;
    }
    if (req.body.start) {
      existingEvent.start = req.body.start;
    }
    if (req.body.end) {
      existingEvent.end = req.body.end;
    }

    await existingEvent.save();
    return res.status(200).json(existingEvent);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Edit Event` });
  }
};

const deleteEvent = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.userIdParam;

    const EventModel = createBigReactCalendarEventModel(userIdParam);
    const deletedEvent = await EventModel.findByIdAndDelete(req.body.eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    return res.status(200).json({ message: "Event deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error deleting event` });
  }
};

const createCheckInEvent = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.userIdParam;
    const user = await User.findById(userIdParam);
    const EventModel = createBigReactCalendarEventModel(userIdParam);

    if (!user) {
      return res.status(409).json({ message: "User not found" });
    }

    user.status = "online";
    user.save();

    // 获取请求中的日期
    const currentDay = new Date(req.body.start);
    // 设置当天开始时间
    currentDay.setHours(0, 0, 0, 0);
    // // 设置当天结束时间
    // const endTime = new Date(startTime);
    // endTime.setHours(23, 59, 59, 999);

    // 查询当天的“Actual Time”事件
    const existingEvent = await EventModel.findOne({
      title: "Working Time",
      start: { $gte: currentDay.toISOString() },
      end: { $exists: false },
    });

    if (existingEvent) {
      return res.status(409).json({ message: "User already checked in" });
    }

    const event = new EventModel(req.body);

    await event.save();
    return res.status(200).json(event._id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Error Create Event` });
  }
};

const createCheckOutEvent = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.userIdParam;
    const user = await User.findById(userIdParam);
    const EventModel = createBigReactCalendarEventModel(userIdParam);

    if (!user) {
      return res.status(409).json({ message: "User not found" });
    }

    user.status = "offline";
    user.save();

    // Get the date in the request
    const currentDay = new Date(req.body.end);
    // Set the start time of the day
    currentDay.setHours(0, 0, 0, 0);
    // // Set end of day time
    // const endTime = new Date(startTime);
    // endTime.setHours(23, 59, 59, 999);

    // 查询当天的“Actual Time”事件
    const existingEvent = await EventModel.findOne({
      title: "Working Time",
      start: { $gte: currentDay.toISOString() },
      end: { $exists: false },
    });

    if (!existingEvent) {
      return res.status(409).json({ message: "User has not checked in" });
    }

    if (req.body.end) {
      existingEvent.end = req.body.end;
    }

    await existingEvent.save();
    return res.status(200).json(existingEvent._id);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: `Error Create Event` });
  }
};

const getPayroll = async (req: Request, res: Response) => {
  try {
    const { userIdParam, payrollDateString, payrollString } = req.params;

    const startDate = new Date("2024-05-27"); // Define the start date of the pay period

    const payrollDate = new Date(payrollDateString);

    const msPerDay = 1000 * 60 * 60 * 24;
    const dayDifference = Math.floor(
      (payrollDate.getTime() - startDate.getTime()) / msPerDay
    );
    const periodNumber = Math.floor(dayDifference / 14);

    const currentPeriodStart = new Date(startDate);
    currentPeriodStart.setDate(startDate.getDate() + periodNumber * 14);

    const currentPeriodEnd = new Date(currentPeriodStart);
    currentPeriodEnd.setDate(currentPeriodStart.getDate() + 13); // 包含14天

    const EventModel = createBigReactCalendarEventModel(userIdParam);
    const attendanceRecords = await EventModel.find({
      $and: [
        { start: { $gte: currentPeriodStart.toISOString() } },
        { end: { $lte: currentPeriodEnd.toISOString() } },
      ],
    });

    let totalWorkHours = 0;

    attendanceRecords.forEach((record) => {
      // // If there is a start and end time
      if (record.title === "Working Time" && record.start && record.end) {
        const start = new Date(record.start);
        const end = new Date(record.end);
        const workHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // 小时为单位
        totalWorkHours += workHours;
      }
    });

    // console.log(attendanceRecords);

    const hours = Math.floor(totalWorkHours);
    const minutes = Number(((totalWorkHours - hours) * 60).toFixed(0));
    const payRoll = attendanceRecords;

    if (payrollString === "payroll") {
      res.status(200).json({ hours, minutes, payRoll });
    } else {
      res.status(200).json({ hours, minutes });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getTotalHrsI = async (req: Request, res: Response) => {
  try {
    const { userIdParam, payrollDate, payRollRequest } = req.params;

    console.log(payrollDate);

    const startDate = new Date("2024-05-27"); // Define the start date of the pay period
    const today = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;
    const dayDifference = Math.floor(
      (today.getTime() - startDate.getTime()) / msPerDay
    );
    const periodNumber = Math.floor(dayDifference / 14);

    const currentPeriodStart = new Date(startDate);
    currentPeriodStart.setDate(startDate.getDate() + periodNumber * 14);

    const currentPeriodEnd = new Date(currentPeriodStart);
    currentPeriodEnd.setDate(currentPeriodStart.getDate() + 13); // 包含14天

    const user = await User.findById(userIdParam);
    const weeklySchedule = user?.schedule;

    const EventModel = createBigReactCalendarEventModel(userIdParam);
    const attendanceRecords = await EventModel.find({
      $and: [
        { start: { $gte: currentPeriodStart.toISOString() } },
        { end: { $lte: currentPeriodEnd.toISOString() } },
      ],
    });

    const convertedTimes = attendanceRecords.map((time) => {
      const startDate = new Date(time.start);
      const endDate = new Date(time.end);
      const dayOfWeek = startDate
        .toLocaleString("en-US", { weekday: "long" })
        .toLowerCase(); // 获取完整的星期几名称

      // const schedule = workSchedule[dayOfWeek];

      const schedule = weeklySchedule
        ? weeklySchedule[dayOfWeek as keyof typeof weeklySchedule]
        : undefined;

      if (!schedule) {
        return;
      }

      const scheduleCheckIn = new Date(time.start); // Assuming time.start is defined
      const scheduleCheckOut = new Date(time.end);

      if (schedule?.checkIn && schedule?.checkOut) {
        const [checkInHr, checkInMin] = schedule.checkIn.split(":").map(Number);
        const [checkOutHr, checkOutMin] = schedule.checkOut
          .split(":")
          .map(Number);

        // Set hours and minutes to the Date object
        scheduleCheckIn.setHours(checkInHr);
        scheduleCheckIn.setMinutes(checkInMin);

        scheduleCheckOut.setHours(checkOutHr);
        scheduleCheckOut.setMinutes(checkOutMin);
      }

      const finalCheckIn =
        startDate > scheduleCheckIn ? startDate : scheduleCheckIn;
      const finalCheckOut =
        endDate < scheduleCheckOut ? endDate : scheduleCheckOut;

      return {
        title: "Working Time",
        start: finalCheckIn.toLocaleString(),
        end: finalCheckOut.toLocaleString(),
      };
    });

    let totalWorkHours = 0;

    convertedTimes.forEach((record) => {
      // // If there is a start and end time
      if (record?.title === "Working Time" && record.start && record.end) {
        const start = new Date(record.start);
        const end = new Date(record.end);
        const workHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // 小时为单位
        totalWorkHours += workHours;
      }
    });

    const hours = Math.floor(totalWorkHours);
    const minutes = Number(((totalWorkHours - hours) * 60).toFixed(0));

    const payRoll = convertedTimes;

    if (payRollRequest) {
      res.status(200).json({ hours, minutes, payRoll });
    } else {
      res.status(200).json({ hours, minutes });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default {
  createEvent,
  editEvent,
  getEvent,
  deleteEvent,
  createCheckInEvent,
  createCheckOutEvent,
  getPayroll,
};
