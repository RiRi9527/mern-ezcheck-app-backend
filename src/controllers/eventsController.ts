import { Request, Response } from "express";
import createBigReactCalendarEventModel from "../models/bigReactCalendarEvent";

const getEvent = async (req: Request, res: Response) => {
  res.sendStatus(200);
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
    const eventIdParam = req.params.eventIdParam;
    const EventModel = createBigReactCalendarEventModel(userIdParam);
    const existingEvent = await EventModel.findById(eventIdParam);

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
    return res.sendStatus(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Edit Event` });
  }
};

export default {
  createEvent,
  editEvent,
  getEvent,
};
