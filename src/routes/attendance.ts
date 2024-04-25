import express from "express";
import attendanceController from "../controllers/attendanceController";
import { validateMyUserRequest } from "../middleware/validation";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/post", verifyToken, attendanceController.createAttendance);

export default router;
