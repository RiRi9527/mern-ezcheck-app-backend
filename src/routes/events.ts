import express, { Response, Request } from "express";
import verifyToken from "../middleware/verifyToken";
import eventsController from "../controllers/eventsController";
import verifyAuth from "../middleware/verifyAuth";

const router = express.Router();

router.get(
  "/get/:userParamsId/:start/:end",
  verifyToken,
  verifyAuth,
  eventsController.getEvent
);
router.get(
  "/pay/:userParamsId/:payrollDateString/:payrollString",
  verifyToken,
  verifyAuth,
  eventsController.getPayroll
);

router.post(
  "/:userParamsId",
  verifyToken,
  verifyAuth,
  eventsController.createEvent
);
router.post(
  "/:userParamsId/checkIn",
  verifyToken,
  verifyAuth,
  eventsController.createCheckInEvent
);

router.put(
  "/:userParamsId",
  verifyToken,
  verifyAuth,
  eventsController.editEvent
);
router.put(
  "/:userParamsId/checkOut",
  verifyToken,
  verifyAuth,
  eventsController.createCheckOutEvent
);

router.delete(
  "/:userParamsId",
  verifyToken,
  verifyAuth,
  eventsController.deleteEvent
);

export default router;
