import { Request, Response } from "express";
import User from "../models/user";
import createBigReactCalendarEventModel from "../models/bigReactCalendarEvent";

const createEvent = () => async (req: Request, res: Response) => {
  try {
    const auth = await User.findById(req.userId);

    const userIdParam = req.params.userParamsId;

    if (
      userIdParam !== req.userId &&
      auth?.position !== "CEO" &&
      auth?.position !== "Office Manager"
    ) {
      return res.status(403).json({ message: "No permission" });
    }
    // check authorization

    const Event = createBigReactCalendarEventModel(userIdParam);

    const existingEvent = await Event.findById(req.body._id);

    if (existingEvent) {
      return res.status(409).json({ message: "Event already exists" });
    }

    const event = new Event(req.body);

    await event.save();

    return res.status(200);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Create Event` });
  }
};

export default {
  createEvent,
};
