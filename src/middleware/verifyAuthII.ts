import { NextFunction, Request, Response } from "express";
import User from "../models/user";

const verifyAuthII = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = await User.findById(req.userId);
    if (auth?.position === "CEO" || auth?.position === "Office Manager") {
      return next();
    }

    return res.status(403).json({ message: "No permission" });
  } catch (error) {
    console.error("Authorization check failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default verifyAuthII;
