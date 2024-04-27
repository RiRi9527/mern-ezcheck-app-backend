import express from "express";
import verifyToken from "../middleware/verifyToken";
import eventsController from "../controllers/eventsController";

const router = express.Router();

router.post("/:userParamsId", verifyToken, eventsController.createEvent);
router.put(
  "/:userParamsId/:eventParamsId",
  verifyToken,
  eventsController.editEvent
);

export default router;
