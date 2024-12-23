// client/src/components/SwapBookingModal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/modal.scss";

const SwapBookingModal = ({ reservation, onClose, onUpdate }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:7700/api/reservations/slots/${reservation.rest._id}/${selectedDate}`
                );
                setAvailableSlots(response.data);
            } catch (err) {
                setError("Error fetching available slots");
            }
        };

        fetchAvailableSlots();
    }, [selectedDate, reservation.rest._id]);

    const handleSwap = async () => {
        if (!selectedSlot) {
            setError("Please select a time slot");
            return;
        }
        
        try {
            await axios.post(`http://localhost:7700/api/reservations/${reservation._id}/swap`, {
                newSlot: selectedSlot,
                newDate: selectedDate,
                restId: reservation.rest._id
            });
            onUpdate();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Error swapping reservation");
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Swap Booking</h2>
                {error && <div className="error-message">{error}</div>}
                
                <div className="current-booking">
                    <h3>Current Booking</h3>
                    <p>Date: {new Date(reservation.date).toLocaleDateString()}</p>
                    <p>Time: {reservation.slot}</p>
                    <p>People: {reservation.people}</p>
                </div>

                <div className="new-booking">
                    <h3>Select New Date and Time</h3>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    <div className="available-slots">
                        <h4>Available Time Slots:</h4>
                        <div className="slots-grid">
                            {availableSlots.map((slot) => (
                                <div
                                    key={slot}
                                    className={`slot ${selectedSlot === slot ? 'selected' : ''}`}
                                    onClick={() => setSelectedSlot(slot)}
                                >
                                    {slot}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="modal-actions">
                    <button 
                        onClick={handleSwap} 
                        className="save-btn"
                        disabled={!selectedSlot}
                    >
                        Confirm Swap
                    </button>
                    <button onClick={onClose} className="cancel-btn">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SwapBookingModal;