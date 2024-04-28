import express, { Response, Request } from "express";
import verifyToken from "../middleware/verifyToken";
import eventsController from "../controllers/eventsController";

const router = express.Router();

router.get("/", eventsController.getEvent);
router.post("/:userIdParam", eventsController.createEvent);

router.put("/:userIdParam/:eventIdParam", eventsController.editEvent);

export default router;
