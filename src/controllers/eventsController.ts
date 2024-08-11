import { Request, Response } from "express";
import createBigReactCalendarEventModel from "../models/bigReactCalendarEvent";
import User from "../models/user";

const getEvent = async (req: Request, res: Response) => {
  try {
    // Extract userParamsId from request parameters
    const { userParamsId, start: rangeStart, end: rangeEnd } = req.params;

    // Adding a 3-second delay
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // Create EventModel based on userParamsId
    const EventModel = createBigReactCalendarEventModel(userParamsId);

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
    const userParamsId = req.params.userParamsId;
    const EventModel = createBigReactCalendarEventModel(userParamsId);
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
    const userParamsId = req.params.userParamsId;
    const EventModel = createBigReactCalendarEventModel(userParamsId);
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
    const userParamsId = req.params.userParamsId;

    const EventModel = createBigReactCalendarEventModel(userParamsId);
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
    const userParamsId = req.params.userParamsId;
    const user = await User.findById(userParamsId);
    const EventModel = createBigReactCalendarEventModel(userParamsId);

    if (!user) {
      return res.status(409).json({ message: "User not found" });
    }

    user.status = "online";
    user.save();

    // Get the date from the request body

    const currentDay = new Date(req.body.start);
    // Set the start time of the day

    currentDay.setHours(0, 0, 0, 0);
    // Set the end time of the day (commented out in the original code)
    // const endTime = new Date(startTime);
    // endTime.setHours(23, 59, 59, 999);

    // Query the "Actual Time" events for the day
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
    const userParamsId = req.params.userParamsId;
    const user = await User.findById(userParamsId);
    const EventModel = createBigReactCalendarEventModel(userParamsId);

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

    // Query the "Actual Time" events for the day

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
    const { userParamsId, payrollDateString, payrollString } = req.params;

    const startDate = new Date("2024-05-27"); // Define the start date of the pay period

    const payrollDate = new Date(payrollDateString);

    if (isNaN(payrollDate.getTime())) {
      return res.status(400).json({ error: "Invalid payrollDateString value" });
    }

    const msPerDay = 1000 * 60 * 60 * 24;
    const dayDifference = Math.floor(
      (payrollDate.getTime() - startDate.getTime()) / msPerDay
    );
    const periodNumber = Math.floor(dayDifference / 14);

    const currentPeriodStart = new Date(startDate);
    currentPeriodStart.setDate(startDate.getDate() + periodNumber * 14);

    const currentPeriodEnd = new Date(currentPeriodStart);
    currentPeriodEnd.setDate(currentPeriodStart.getDate() + 13); // 包含14天

    const user = await User.findById(userParamsId);
    const weeklySchedule = user?.schedule;

    const EventModel = createBigReactCalendarEventModel(userParamsId);
    const attendanceRecords = await EventModel.find({
      $and: [
        { start: { $gte: currentPeriodStart.toISOString() } },
        { end: { $lte: currentPeriodEnd.toISOString() } },
      ],
    });

    attendanceRecords.sort((a, b) => {
      return new Date(a.start).getTime() - new Date(b.start).getTime();
    });

    if (user?.position === "Customer Service I") {
      const convertedTimes = attendanceRecords.map((time) => {
        const startDate = new Date(time.start);
        const endDate = new Date(time.end);
        const dayOfWeek = startDate
          .toLocaleString("en-US", { weekday: "long" })
          .toLowerCase(); // Get the full name of the day of the week

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
          const [checkInHr, checkInMin] = schedule.checkIn
            .split(":")
            .map(Number);
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
          const workHours =
            (end.getTime() - start.getTime()) / (1000 * 60 * 60); // in units of hours
          totalWorkHours += workHours;
        }
      });

      const hours = Math.floor(totalWorkHours);
      const minutes = Number(((totalWorkHours - hours) * 60).toFixed(0));
      const payRoll = convertedTimes;
      const weekStartDateString = currentPeriodStart.toISOString();
      const weekEndDateString = currentPeriodEnd.toISOString();

      if (payrollString === "payroll") {
        return res.status(200).json({
          hours,
          minutes,
          payRoll,
          weekStartDateString,
          weekEndDateString,
        });
      } else {
        return res.status(200).json({ hours, minutes });
      }
    }

    let totalWorkHours = 0;

    attendanceRecords.forEach((record) => {
      // // If there is a start and end time
      if (record.title === "Working Time" && record.start && record.end) {
        const start = new Date(record.start);
        const end = new Date(record.end);
        const workHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // In units of hours

        totalWorkHours += workHours;
      }
    });

    // console.log(attendanceRecords);

    const hours = Math.floor(totalWorkHours);
    const minutes = Number(((totalWorkHours - hours) * 60).toFixed(0));
    const payRoll = attendanceRecords;
    const weekStartDateString = currentPeriodStart.toISOString();
    const weekEndDateString = currentPeriodEnd.toISOString();

    if (payrollString === "payroll") {
      res.status(200).json({
        hours,
        minutes,
        payRoll,
        weekStartDateString,
        weekEndDateString,
      });
    } else {
      res.status(200).json({ hours, minutes });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// const getTotalHrsI = async (req: Request, res: Response) => {
//   try {
//     const { userParamsId, payrollDate, payRollRequest } = req.params;

//     // console.log(payrollDate);

//     const startDate = new Date("2024-05-27"); // Define the start date of the pay period
//     const today = new Date();
//     const msPerDay = 1000 * 60 * 60 * 24;
//     const dayDifference = Math.floor(
//       (today.getTime() - startDate.getTime()) / msPerDay
//     );
//     const periodNumber = Math.floor(dayDifference / 14);

//     const currentPeriodStart = new Date(startDate);
//     currentPeriodStart.setDate(startDate.getDate() + periodNumber * 14);

//     const currentPeriodEnd = new Date(currentPeriodStart);
//     currentPeriodEnd.setDate(currentPeriodStart.getDate() + 13); // Includes 14 days

//     const user = await User.findById(userParamsId);
//     const weeklySchedule = user?.schedule;

//     const EventModel = createBigReactCalendarEventModel(userParamsId);
//     const attendanceRecords = await EventModel.find({
//       $and: [
//         { start: { $gte: currentPeriodStart.toISOString() } },
//         { end: { $lte: currentPeriodEnd.toISOString() } },
//       ],
//     });

//     const convertedTimes = attendanceRecords.map((time) => {
//       const startDate = new Date(time.start);
//       const endDate = new Date(time.end);
//       const dayOfWeek = startDate
//         .toLocaleString("en-US", { weekday: "long" })
//         .toLowerCase(); // Get the full name of the day of the week

//       // const schedule = workSchedule[dayOfWeek];

//       const schedule = weeklySchedule
//         ? weeklySchedule[dayOfWeek as keyof typeof weeklySchedule]
//         : undefined;

//       if (!schedule) {
//         return;
//       }

//       const scheduleCheckIn = new Date(time.start); // Assuming time.start is defined
//       const scheduleCheckOut = new Date(time.end);

//       if (schedule?.checkIn && schedule?.checkOut) {
//         const [checkInHr, checkInMin] = schedule.checkIn.split(":").map(Number);
//         const [checkOutHr, checkOutMin] = schedule.checkOut
//           .split(":")
//           .map(Number);

//         // Set hours and minutes to the Date object
//         scheduleCheckIn.setHours(checkInHr);
//         scheduleCheckIn.setMinutes(checkInMin);

//         scheduleCheckOut.setHours(checkOutHr);
//         scheduleCheckOut.setMinutes(checkOutMin);
//       }

//       const finalCheckIn =
//         startDate > scheduleCheckIn ? startDate : scheduleCheckIn;
//       const finalCheckOut =
//         endDate < scheduleCheckOut ? endDate : scheduleCheckOut;

//       return {
//         title: "Working Time",
//         start: finalCheckIn.toLocaleString(),
//         end: finalCheckOut.toLocaleString(),
//       };
//     });

//     let totalWorkHours = 0;

//     convertedTimes.forEach((record) => {
//       // // If there is a start and end time
//       if (record?.title === "Working Time" && record.start && record.end) {
//         const start = new Date(record.start);
//         const end = new Date(record.end);
//         const workHours = (end.getTime() - start.getTime()) / (1000 * 60 * 60); // in units of hours
//         totalWorkHours += workHours;
//       }
//     });

//     const hours = Math.floor(totalWorkHours);
//     const minutes = Number(((totalWorkHours - hours) * 60).toFixed(0));

//     const payRoll = convertedTimes;

//     if (payRollRequest) {
//       res.status(200).json({ hours, minutes, payRoll });
//     } else {
//       res.status(200).json({ hours, minutes });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };

export default {
  createEvent,
  editEvent,
  getEvent,
  deleteEvent,
  createCheckInEvent,
  createCheckOutEvent,
  getPayroll,
};
