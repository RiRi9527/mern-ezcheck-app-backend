import express, { Response, Request } from "express";

import authController from "../controllers/authController";
import { validateLoginRequest } from "../middleware/validation";
import verifyToken from "../middleware/verifyToken";

const router = express.Router();

router.post("/login", validateLoginRequest, authController.authLogin);

router.get(
  "/validate-token",
  verifyToken,
  authController.verifyTokenReturnAuth
);

router.post("/logout", (req: Request, res: Response) => {
  res.cookie("auth_token", "", {
    expires: new Date(0),
  });
  res.send();
});

router.get("/users", authController.authGetAllUsers);

export default router;
