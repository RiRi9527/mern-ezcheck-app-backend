import express, { Response, Request } from "express";
import verifyToken from "../middleware/verifyToken";
import eventsController from "../controllers/eventsController";
import verifyAuth from "../middleware/verifyAuth";
import verifyAuthIII from "../middleware/verifyAuthIII";
import verifyAuthII from "../middleware/verifyAuthII";

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
  verifyAuthII,
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
  verifyAuthII,
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
  verifyAuthII,
  eventsController.deleteEvent
);

export default router;
