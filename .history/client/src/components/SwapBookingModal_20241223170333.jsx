// client/src/SwapBookingModal.jsx

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/modal.scss";

const SwapBookingModal = ({ currentReservation, onClose, onSwap }) => {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchAvailableSlots = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:7700/api/reservations/slots/${currentReservation.rest._id}/${selectedDate}`,
                    { withCredentials: false }
                );
                setAvailableSlots(response.data || []);
            } catch (err) {
                setError("Error fetching available slots");
                console.error(err);
            }
        };

        if (selectedDate) {
            fetchAvailableSlots();
        }
    }, [selectedDate, currentReservation.rest._id]);

    const handleSwap = async () => {
        if (!selectedSlot) {
            setError("Please select a time slot");
            return;
        }

        setLoading(true);
        try {
            await axios.post(
                `http://localhost:7700/api/reservations/${currentReservation._id}/swap`,
                {
                    newSlot: selectedSlot,
                    newDate: selectedDate,
                    restId: currentReservation.rest._id
                },
                { withCredentials: false }
            );
            onSwap();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Error swapping reservation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Swap Booking</h2>
                {error && <div className="error-message">{error}</div>}
                
                <div className="current-booking">
                    <h3>Current Booking</h3>
                    <p>Date: {currentReservation.date.substring(0, 10)}</p>
                    <p>Time: {currentReservation.slot}</p>
                    <p>People: {currentReservation.people}</p>
                </div>

                <div className="form-group">
                    <label>Select New Date:</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => {
                            setSelectedDate(e.target.value);
                            setSelectedSlot(null);
                        }}
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
                        {availableSlots.length === 0 && (
                            <p>No available slots for this date</p>
                        )}
                    </div>
                </div>

                <div className="modal-actions">
                    <button 
                        onClick={handleSwap} 
                        className="save-btn"
                        disabled={!selectedSlot || loading}
                    >
                        {loading ? 'Swapping...' : 'Confirm Swap'}
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