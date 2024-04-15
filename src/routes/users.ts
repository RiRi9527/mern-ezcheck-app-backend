import express from "express";
import multer from "multer";
import userController from "../controllers/userController";
import { validateMyUserRequest } from "../middleware/validation";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, //5mb
  },
});

router.get("/:userParamsId", verifyToken, userController.getCurrentUser);

router.post(
  "/register",
  verifyToken,
  upload.single("imageFile"),
  validateMyUserRequest,
  userController.createCurrentUser
);

router.put(
  "/:userParamsId",
  verifyToken,
  upload.single("imageFile"),
  validateMyUserRequest,
  userController.editCurrentUser
);

export default router;
