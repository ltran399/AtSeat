import express from "express";
import {
  createReservation,
  getReservationsByUserId,
  getReservationsByRestId,
  deleteReservation,
  checkAvailableSlots,
  updateReservation,
  swapReservation
} from "../controllers/reservation.js";

const router = express.Router();

router.get("/slots/:id/:date", checkAvailableSlots);
router.post("/", createReservation);
router.delete("/:id", deleteReservation);
router.get("/rest/:id", getReservationsByRestId);
router.get("/user/:id", getReservationsByUserId);
router.put("/:id", updateReservation);
router.post("/:id/swap", swapReservation);

export default router;