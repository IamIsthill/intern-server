import { Admin } from "../models/Admin.js";
import { Intern } from "../models/interns.js";
import { Supervisor } from "../models/Supervisor.js";
import { createId } from "../utils/createId.js";
import Joi from "joi";


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
    const interns = await Intern.find({
      $or: [
        { firstName: { $regex: q } },
        { lastName: { $regex: q } },
        { email: { $regex: q } },
        { status: { $regex: q } },
        { accountType: { $regex: q } },
      ],
      isApproved: 'approved'
    }).select(['firstName', 'lastName', 'email', 'accountType', '_id', 'status']).lean()
    const supervisors = await Supervisor.find({
      $or: [
        { firstName: { $regex: q } },
        { lastName: { $regex: q } },
        { email: { $regex: q } },
        { status: { $regex: q } },
        { accountType: { $regex: q } },
      ]
    }).select(['firstName', 'lastName', 'email', 'accountType', '_id', 'status']).lean()
    const accounts = interns.concat(supervisors)

    return res.status(200).json({ accounts: accounts })


  } catch (err) {
    next(err)
  }
}

export const getRequestingInterns = async (req, res, next) => {
  try {
    const interns = await Intern.find({ isApproved: 'pending' }).select(['firstName', 'lastName', 'email', 'accountType', '_id', 'status'])
    return res.status(200).json({ accounts: interns })

  } catch (err) {
    next(err)
  }
}

const validateInternId = Joi.object({
  internId: Joi.string().length(24),
  isApproved: Joi.boolean()
})

export const approveInternRequest = async (req, res, next) => {
  try {
    const { error, value } = validateInternId.validate(req.body)

    if (error) {
      const messages = error.details.map(detail => detail.message)
      return res.status(400).json({ message: messages.join("\n") })
    }

    const { internId, isApproved } = value

    const updatedIntern = await Intern.findOneAndUpdate({ _id: createId(internId) }, { isApproved: isApproved ? 'approved' : 'rejected', status: 'active' }, { new: true }).select(['firstName', 'lastName', 'email', 'accountType', '_id', 'status'])

    return res.status(200).json({ account: updatedIntern })
  } catch (e) {
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
