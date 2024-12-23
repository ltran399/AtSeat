// client/src/components/SwapBookingModal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/swapBookingModal.scss";

const SwapBookingModal = ({ currentReservation, onClose, onSwap }) => {
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);

    useEffect(() => {
        // Fetch available slots for the restaurant
        const fetchAvailableSlots = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:7700/api/restaurants/${currentReservation.rest._id}/available-slots`,
                    { withCredentials: false }
                );
                setAvailableSlots(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        fetchAvailableSlots();
    }, [currentReservation.rest._id]);

    const handleSwap = async () => {
        if (!selectedSlot) return;
        
        try {
            const response = await axios.post(
                `http://localhost:7700/api/reservations/${currentReservation._id}/swap`,
                { newSlot: selectedSlot },
                { withCredentials: false }
            );
            onSwap(response.data);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Swap Booking</h2>
                <div className="current-booking">
                    <h3>Current Booking</h3>
                    <p>Date: {currentReservation.date.substring(0, 10)}</p>
                    <p>Time: {currentReservation.slot}</p>
                    <p>People: {currentReservation.people}</p>
                </div>
                <div className="available-slots">
                    <h3>Available Slots</h3>
                    <div className="slots-grid">
                        {availableSlots.map((slot) => (
                            <div
                                key={`${slot.date}-${slot.time}`}
                                className={`slot ${selectedSlot === slot ? 'selected' : ''}`}
                                onClick={() => setSelectedSlot(slot)}
                            >
                                <p>{new Date(slot.date).toLocaleDateString()}</p>
                                <p>{slot.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-actions">
                    <button 
                        onClick={handleSwap} 
                        className="swap-btn"
                        disabled={!selectedSlot}
                    >
                        Confirm Swap
                    </button>
                    <button onClick={onClose} className="cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default SwapBookingModal;