import { Router } from "express";
import {
  getReservations,
  getReservationById,
  createReservation,
  cancelReservation,
} from "../controllers/reservations.controller.js";

const router = Router();

router.get("/", getReservations);
router.get("/:id", getReservationById);
router.post("/", createReservation);
router.delete("/:id", cancelReservation);

export default router;
