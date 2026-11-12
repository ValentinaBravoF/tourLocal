import { Router } from "express";

import {
  getSchedules,
  getScheduleById,
} from "../controllers/schedules.controller.js";

const router = Router();

router.get("/", getSchedules);
router.get("/:id", getScheduleById);

export default router;
