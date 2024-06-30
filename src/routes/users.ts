import express from "express";
import multer from "multer";
import userController from "../controllers/userController";
import { validateMyUserRequest } from "../middleware/validation";
import verifyToken from "../middleware/verifyToken";
import verifyAuth from "../middleware/verifyAuth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.get(
  "/:userParamsId",
  verifyToken,
  verifyAuth,
  userController.getCurrentUser
);

router.post(
  "/register",
  verifyToken,
  verifyAuth,
  upload.single("imageFile"),
  validateMyUserRequest,
  userController.createCurrentUser
);

router.put(
  "/:userParamsId",
  verifyToken,
  verifyAuth,
  upload.single("imageFile"),
  validateMyUserRequest,
  userController.editCurrentUser
);

router.put(
  "/:userParamsId/schedule",
  verifyToken,
  verifyAuth,
  userController.editCurrentUserSchedule
);

router.put(
  "/:userParamsId/status",
  verifyToken,
  userController.editCurrentUserStatus
);

export default router;
