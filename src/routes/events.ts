import express, { Response, Request } from "express";
import verifyToken from "../middleware/verifyToken";
import eventsController from "../controllers/eventsController";

const router = express.Router();

router.get("/get/:userIdParam/:start/:end", eventsController.getEvent);
router.get(
  "/pay/:userIdParam/:payrollDateString/:payrollString",
  eventsController.getPayroll
);

router.post("/:userIdParam", eventsController.createEvent);
router.post("/:userIdParam/checkIn", eventsController.createCheckInEvent);

router.put("/:userIdParam", eventsController.editEvent);
router.put("/:userIdParam/checkOut", eventsController.createCheckOutEvent);

router.delete("/:userIdParam", eventsController.deleteEvent);

export default router;
