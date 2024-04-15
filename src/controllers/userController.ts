import { Request, Response } from "express";
import User from "../models/user";
import cloudinary from "cloudinary";

const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.userParamsId;

    const user = await User.findById(userIdParam);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error Getting User" });
  }
};

const createCurrentUser = async (req: Request, res: Response) => {
  try {
    const existingUser = await User.findOne({
      userName: req.body.userName,
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = new User(req.body);

    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      user.imageUrl = imageUrl;
    }

    await user.save();

    return res.status(200).json(user._id);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error creating user` });
  }
};

const editCurrentUser = async (req: Request, res: Response) => {
  try {
    const userIdParam = req.params.userParamsId;
    const user = await User.findById(userIdParam);

    if (!user) {
      return res.status(409).json({ message: "User not found" });
    }

    user.userName = req.body.userName;
    user.password = req.body.password;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.position = req.body.position;
    user.hourlyWage = req.body.hourlyWage;
    user.isAdmin = req.body.isAdmin;
    if (req.file) {
      const imageUrl = await uploadImage(req.file as Express.Multer.File);
      user.imageUrl = imageUrl;
    }
    await user.save();

    return res.status(200).send(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error changing user` });
  }
};

const uploadImage = async (file: Express.Multer.File) => {
  const image = file;
  const base64Image = Buffer.from(image.buffer).toString("base64");
  const dataURI = `data:${image.mimetype};base64,${base64Image}`;

  const uploadResponse = await cloudinary.v2.uploader.upload(dataURI);
  return uploadResponse.url;
};

export default {
  createCurrentUser,
  getCurrentUser,
  editCurrentUser,
};
