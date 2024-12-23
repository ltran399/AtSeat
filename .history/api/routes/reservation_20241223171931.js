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

router.get("/available-for-swap/:id", async (req, res) => {
  try {
      // Get the current reservation
      const currentReservation = await Reservation.findById(req.params.id)
          .populate('author')
          .populate('rest');

      if (!currentReservation) {
          return res.status(404).json({ message: "Reservation not found" });
      }

      // Find all other reservations for the same restaurant
      // that are not the current reservation
      const availableReservations = await Reservation.find({
          _id: { $ne: req.params.id }, // exclude current reservation
          rest: currentReservation.rest._id // same restaurant
      })
      .populate('author')
      .populate('rest');

      res.status(200).json(availableReservations);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error fetching available reservations" });
  }
});

// Also add the swap endpoint
router.put("/swap", async (req, res) => {
  try {
      const { reservation1Id, reservation2Id } = req.body;

      // Get both reservations
      const reservation1 = await Reservation.findById(reservation1Id);
      const reservation2 = await Reservation.findById(reservation2Id);

      if (!reservation1 || !reservation2) {
          return res.status(404).json({ message: "One or both reservations not found" });
      }

      // Swap the authors
      const temp = reservation1.author;
      reservation1.author = reservation2.author;
      reservation2.author = temp;

      // Save both reservations
      await reservation1.save();
      await reservation2.save();

      // Return updated reservations with populated fields
      const updatedReservation1 = await Reservation.findById(reservation1Id)
          .populate('author')
          .populate('rest');

      res.status(200).json(updatedReservation1);
  } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error swapping reservations" });
  }
});

export default router;