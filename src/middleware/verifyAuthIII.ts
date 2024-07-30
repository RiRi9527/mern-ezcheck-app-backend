import { NextFunction, Request, Response } from "express";
import User from "../models/user";

const verifyAuthIII = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const auth = await User.findById(req.userId);
    if (auth?.position !== "CEO") {
      return res.status(403).json({ message: "No permission" });
    }

    next();
  } catch (error) {
    console.error("Authorization check failed:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default verifyAuthIII;
