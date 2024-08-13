import { NextFunction, Request, Response } from "express";
import User from "../models/user";

const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const auth = await User.findById(req.userId);
    const userIdParam = req.params.userParamsId;

    if (
      userIdParam === req.userId ||
      auth?.position === "CEO" ||
      auth?.position === "Office Manager"
    ) {
      return next();
    }

    return res.status(403).json({ message: "No permission" });
  } catch (error) {
    console.error("Authorization check failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default verifyAuth;
