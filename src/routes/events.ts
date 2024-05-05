import express, { Response, Request } from "express";
import verifyToken from "../middleware/verifyToken";
import eventsController from "../controllers/eventsController";

const router = express.Router();

router.get("/:userIdParam", eventsController.getEvent);
router.post("/:userIdParam", eventsController.createEvent);
router.post("/:userIdParam/checkIn", eventsController.createCheckInEvent);

router.put("/:userIdParam", eventsController.editEvent);

router.delete("/:userIdParam", eventsController.deleteEvent);

export default router;
