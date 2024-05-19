import { body, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const validateMyUserRequest = [
  body("userName")
    .isString()
    .notEmpty()
    .withMessage("userName must be a string"),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("password must be a string"),
  body("firstName")
    .isString()
    .notEmpty()
    .withMessage("firstName must be a string"),
  body("lastName")
    .isString()
    .notEmpty()
    .withMessage("lastName must be a string"),
  body("position")
    .isString()
    .optional()
    .withMessage("position must be a string"),
  body("hourlyWage")
    .isNumeric()
    .notEmpty()
    .withMessage("hourlyWage must be a number"),
  handleValidationErrors,
  body("imageUrl")
    .isString()
    .optional()
    .withMessage("position must be a string"),
];

export const validateLoginRequest = [
  body("userName")
    .isString()
    .notEmpty()
    .withMessage("userName must be a string"),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("password must be a string"),
  handleValidationErrors,
];
