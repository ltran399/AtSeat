import express from "express";
import {
  createReservation,
  getReservationsByUserId,
  getReservationsByRestId,
  deleteReservation,
  checkAvailableSlots
} from "../controllers/reservation.js";

const router = express.Router();

router.get("/slots/:id/:date", checkAvailableSlots)
router.post("/", createReservation);
router.delete("/:id", deleteReservation);
router.get("/rest/:id", getReservationsByRestId);
router.get("/user/:id", getReservationsByUserId);
router.put('/reservations/:id', async (req, res) => {
  try {
      const updatedReservation = await Reservation.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
      );
      res.json(updatedReservation);
  } catch (err) {
      res.status(500).json({ message: err.message });
  }
});
export default router;