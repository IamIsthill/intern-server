import { Admin } from "../models/Admin.js";
import { findAllAccounts, findAndUpdateIntern, findPendingInternRequest } from "../services/admin.services.js";
import { approveInternRequestValidator } from '../validations/adminValidator.js'

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
