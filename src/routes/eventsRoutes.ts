import express from "express";
import verifyToken from "../middleware/verifyToken";
import eventsController from "../controllers/eventsController";

const router = express.Router();

router.post("/post", verifyToken, eventsController.createEvent);

export default router;
