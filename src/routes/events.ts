import express, { Response, Request } from "express";
import verifyToken from "../middleware/verifyToken";
import eventsController from "../controllers/eventsController";

const router = express.Router();

router.get("/:userIdParam/:start/:end", eventsController.getEvent);
router.get("/:userIdParam/hrs", eventsController.getTotalHrs);

router.post("/:userIdParam", eventsController.createEvent);
router.post("/:userIdParam/checkIn", eventsController.createCheckInEvent);

router.put("/:userIdParam", eventsController.editEvent);
router.put("/:userIdParam/checkOut", eventsController.createCheckOutEvent);

router.delete("/:userIdParam", eventsController.deleteEvent);

export default router;
