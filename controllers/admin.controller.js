import { Admin } from "../models/Admin.js";
import { Intern } from "../models/interns.js";
import { findAllAccounts, findAndUpdateIntern, findPendingInternRequest } from "../services/admin.services.js";
import { approveInternRequestValidator } from '../validations/adminValidator.js'
import { registerInternValidator } from "../validations/interns-validators.js";
import { findInternByEmail, findInternByPhone, registerIntern } from "../services/interns-auth-services.js";
import { createId } from "../utils/createId.js";
import { validatePassword } from "../utils/validatePassword.js";

export const adminFindController = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const admin = await Admin.findOne({ email: email })
      .select("-password")
      .lean();

    if (admin === null) {
      return res.status(400).json({ message: "No account found" });
    }

    return res.status(201).json(admin);
  } catch (e) {
    next(e);
  }
};

export const getAllAccounts = async (req, res, next) => {
  try {
    const queryObject = req.query
    if (Object.keys(queryObject).length > 0 && !('q' in req.query)) {
      return res.status(200).json({ accounts: [] })
    }
    const q = req.query.q ? req.query.q.trim() : ''

    const accounts = await findAllAccounts(q)

    return res.status(200).json({ accounts: accounts })


  } catch (err) {
    next(err)
  }
}

export const getRequestingInterns = async (req, res, next) => {
  try {
    const interns = await findPendingInternRequest()
    return res.status(200).json({ accounts: interns })

  } catch (err) {
    next(err)
  }
}

export const approveInternRequest = async (req, res, next) => {
  try {
    const { error, value } = approveInternRequestValidator.validate(req.body)

    if (error) {
      const messages = error.details.map(detail => detail.message)
      return res.status(400).json({ message: messages.join("\n") })
    }

    const updatedIntern = await findAndUpdateIntern(value.internId, value.isApproved)

    return res.status(200).json({ account: updatedIntern })
  } catch (e) {
    console.log(e)
    next(e)
  }
}

export const createIntern = async (req, res, next) => {
  try {
    const { error, value } = registerInternValidator.validate(req.body);
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return res.status(400).json({ message: errorMessages.join(", ") });
    }
    validatePassword(value.password)
    const { email, phone } = value;
    const existingUser = await findInternByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingPhone = await findInternByPhone(phone);
    if (existingPhone) {
      return res.status(400).json({ message: "Phone number already exists" });
    }
    value.department = createId(value.department)
    value.supervisor = createId(value.supervisor)
    const user = await Intern.create(value)
    const obj = user.toObject()
    delete obj.password
    delete obj.__v
    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message })
    }
    next(error);
  }
};

// export const adminLoginController = async (req, res, next) => {
//   try {
//     const { error, value } = loginAdminValidator.validate(req.body);

//     if (error) {
//       const errorMessages = error.details.map((detail) => detail.message);
//       return res.status(400).json({ message: errorMessages.join(", ") });
//     }

//     const { email, password } = value;

//     const admin = await Admin.findOne({ email: email }).lean();

//     if (admin === null) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     const isPasswordCorrect = await bcrypt.compare(password, admin.password);

//     if (!isPasswordCorrect) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       {
//         id: admin._id,
//         email: admin.email,
//         accountType: admin.accountType,
//       },
//       JWT_SECRET,
//       { expiresIn: 60 * 60 }
//     );

//     return res.status(200).json({ message: "Login Successful", token: token });
//   } catch (e) {
//     next(e);
//   }
// };
