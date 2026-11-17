import { Router } from "express";
import {
  registerUser,
  loginUser,
  updateProfile,
  getProfile,
} from "../controllers/users.controller.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/profile", updateProfile);
router.get("/profile", getProfile);

export default router;
