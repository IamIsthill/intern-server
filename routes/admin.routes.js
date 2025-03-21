import { Router } from "express";
import {
  adminFindController,
  getAllAccounts,
  getRequestingInterns,
  approveInternRequest,
  createIntern,
  updateAdminController,
  getAdminByIdController,
} from "../controllers/admin.controller.js";
import { validateAccess } from "../middleware/access.js";

export const adminRouter = Router();

adminRouter.get("/find", adminFindController);
adminRouter.get("/accounts", validateAccess("admin"), getAllAccounts);
adminRouter.post("/accounts/intern", validateAccess("admin"), createIntern);
adminRouter.get(
  "/accounts/intern-request",
  validateAccess("admin"),
  getRequestingInterns
);
adminRouter.put(
  "/accounts/intern-request",
  validateAccess("admin"),
  approveInternRequest
);
adminRouter.put(
  "/edit-profile/:id",
  validateAccess("admin"),
  updateAdminController
);
adminRouter.get(
  "/get-admin/:id",
  validateAccess("admin"),
  getAdminByIdController
);
