import express from "express";
import multer from "multer";
import userController from "../controllers/userController";
import { validateMyUserRequest } from "../middleware/validation";
import verifyToken from "../middleware/verifyToken";
import verifyAuth from "../middleware/verifyAuth";
import verifyAuthIII from "../middleware/verifyAuthIII";
import verifyAuthII from "../middleware/verifyAuthII";

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
  verifyAuthIII,
  upload.single("imageFile"),
  validateMyUserRequest,
  userController.createCurrentUser
);

router.put(
  "/:userParamsId",
  verifyToken,
  verifyAuthIII,
  upload.single("imageFile"),
  validateMyUserRequest,
  userController.editCurrentUser
);

router.put(
  "/:userParamsId/schedule",
  verifyToken,
  verifyAuthII,
  userController.editCurrentUserSchedule
);

router.put(
  "/:userParamsId/status",
  verifyToken,
  verifyAuth,
  userController.editCurrentUserStatus
);

export default router;
