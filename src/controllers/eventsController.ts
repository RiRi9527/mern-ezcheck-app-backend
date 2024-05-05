import { Request, Response } from "express";
import createBigReactCalendarEventModel from "../models/bigReactCalendarEvent";

const getEvent = async (req: Request, res: Response) => {
  try {
    // Extract userIdParam from request parameters
    const userIdParam = req.params.userIdParam;
    // Create EventModel based on userIdParam
    const EventModel = createBigReactCalendarEventModel(userIdParam);

    // Retrieve all events that match the condition
    const events = await EventModel.find();

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
    return res.status(200).json(event._id);
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
    if (req.body.startTime) {
      existingEvent.startTime = req.body.startTime;
    }
    if (req.body.endTime) {
      existingEvent.endTime = req.body.endTime;
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
    const EventModel = createBigReactCalendarEventModel(userIdParam);

    // 获取请求中的日期
    const startTime = new Date(req.body.startTime);
    // 设置当天开始时间
    startTime.setHours(0, 0, 0, 0);
    // // 设置当天结束时间
    // const endTime = new Date(startTime);
    // endTime.setHours(23, 59, 59, 999);

    // 查询当天的“Actual Time”事件
    const existingEvent = await EventModel.findOne({
      title: "Actual Time",
      startTime: { $gte: startTime.toString() },
      endTime: { $exists: false },
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

export default {
  createEvent,
  editEvent,
  getEvent,
  deleteEvent,
  createCheckInEvent,
};

// const updatedAttendance = await Attendance.findOneAndUpdate(
//   {
//     startTime: { $gte: today },
//     endTime: { $exists: false },
//   },
//   {
//     endTime: new Date().toLocaleTimeString(),
//   },
//   {
//     new: true, // 返回更新后的文档
//   }
// );
