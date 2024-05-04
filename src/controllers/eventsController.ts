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

export default {
  createEvent,
  editEvent,
  getEvent,
  deleteEvent,
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
