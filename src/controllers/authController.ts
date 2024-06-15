import { Request, Response } from "express";
import User from "../models/user";
import jwt from "jsonwebtoken";

const authLogin = async (req: Request, res: Response) => {
  const { userName, password } = req.body;

  try {
    const user = await User.findOne({ userName });
    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const isMatch = password === user.password;

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
      domain: process.env.COOKIE_DOMAIN, // set to your main domain with a leading dot, i.e. '.onrender.com'
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // if you want to ensure cookies are sent in all contexts
    });

    return res.status(200).json({ userId: user._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error Login` });
  }
};

const authGetAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("firstName imageUrl status");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const verifyTokenReturnAuth = async (req: Request, res: Response) => {
  try {
    const auth = await User.findById(req.userId);
    if (!auth) {
      return res.status(404).json({ message: "Auth not found" });
    }
    res.json(auth);
  } catch (error) {
    console.error("Error fetching auth:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  authLogin,
  authGetAllUsers,
  verifyTokenReturnAuth,
};
