const {
  registerIntern,
  findInternByEmail,
  loginIntern,
  findInternByPhone,
} = require("../services/interns-auth-services");
const {
  registerInternValidator,
  loginInternValidator,
} = require("../validations/interns-validators");
const { BadRequestError } = require("../utils/errors");

export const registerInternController = async (req, res, next) => {
  try {
    const { error, value } = registerInternValidator.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: errorMessages.join(", ") });
    }
    const { email, phone } = value;
    const existingUser = await findInternByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhone = await findInternByPhone(phone);
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }
    const user = await registerIntern(value);
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

export const loginInternController = async (req, res, next) => {
  try {
    const { error, value } = loginInternValidator.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      throw new BadRequestError(errorMessages.join(", "));
    }
    const { email, password } = value;
    const { message, token } = await loginIntern({ email, password });
    res.status(200).json({ message, token });
  } catch (error) {
    next(error);
  }
};
export const checkEmailAvailability = async (req, res, next) => {
  try {
    const { email } = req.query;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await findInternByEmail(cleanEmail);

    if (existingUser && existingUser.email.toLowerCase() === cleanEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    res.status(200).json({ message: "Email is available" });
  } catch (error) {
    next(error);
  }
};

export const checkPhoneAvailability = async (req, res, next) => {
  try {
    const { phone } = req.query;

    if (!phone) {
      return res.status(400).json({ message: "Phone number is required" });
    }
    const cleanPhone = phone.trim();
    const existingUser = await findInternByPhone({ phone: cleanPhone });

    if (existingUser && existingUser.phone === cleanPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    res.status(200).json({ message: "Phone number is available" });
  } catch (error) {
    next(error);
  }
};
