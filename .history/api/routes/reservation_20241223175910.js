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
import Reservation from "../models/Reservation.js";  // Add this import

const router = express.Router();

router.get("/slots/:id/:date", checkAvailableSlots);
router.post("/", createReservation);
router.delete("/:id", deleteReservation);
router.get("/rest/:id", getReservationsByRestId);
router.get("/user/:id", getReservationsByUserId);
router.put("/:id", updateReservation);
router.post("/:id/swap", swapReservation);
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

// server/routes/reservations.js
router.get("/available-for-swap/:id", async (req, res) => {
  try {
      const currentReservation = await Reservation.findById(req.params.id)
          .populate('author')  // This populates the author field
          .populate('rest');

      console.log("Current reservation:", currentReservation); // Add this to debug

      const availableReservations = await Reservation.find({
          _id: { $ne: req.params.id },
          rest: currentReservation.rest._id
      })
      .populate('author')  // This populates the author field
      .populate('rest');

      console.log("Available reservations:", availableReservations); // Add this to debug

      res.status(200).json(availableReservations);
  } catch (err) {
      console.error("Error in available-for-swap:", err);
      res.status(500).json({ 
          message: "Error fetching available reservations",
          error: err.message 
      });
  }
});

// Also add the swap endpoint

export default router;