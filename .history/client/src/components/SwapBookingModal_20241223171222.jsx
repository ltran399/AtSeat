import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "../styles/modal.scss";

const SwapBookingModal = ({ currentReservation, onClose, onSwap }) => {
    const [availableReservations, setAvailableReservations] = useState([]);
    const [selectedReservation, setSelectedReservation] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetchLoading, setFetchLoading] = useState(true);

    // Fetch all other reservations for the same restaurant, date, and slot
    useEffect(() => {
        const fetchReservations = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:7700/api/reservations/available-for-swap/${currentReservation._id}`,
                    { withCredentials: false }
                );
                setAvailableReservations(response.data);
            } catch (err) {
                setError('Error fetching available reservations');
            } finally {
                setFetchLoading(false);
            }
        };

        fetchReservations();
    }, [currentReservation._id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedReservation) {
            setError('Please select a reservation to swap with');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Send both reservation IDs to swap their user IDs
            const response = await axios.put(
                `http://localhost:7700/api/reservations/swap`,
                {
                    reservation1Id: currentReservation._id,
                    reservation2Id: selectedReservation
                },
                { withCredentials: false }
            );
            
            onSwap(response.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Error swapping reservations');
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Swap Booking</h2>
                {error && <div className="error-message">{error}</div>}
                
                {fetchLoading ? (
                    <div>Loading available reservations...</div>
                ) : availableReservations.length === 0 ? (
                    <div>No available reservations to swap with.</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Select Reservation to Swap With:</label>
                            <select
                                value={selectedReservation}
                                onChange={(e) => setSelectedReservation(e.target.value)}
                                required
                            >
                                <option value="">Select a reservation</option>
                                {availableReservations.map((reservation) => (
                                    <option key={reservation._id} value={reservation._id}>
                                        User: {reservation.user.name} - Date: {new Date(reservation.date).toLocaleDateString()} - Time: {reservation.slot}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="current-reservation-details">
                            <h3>Current Reservation Details:</h3>
                            <p>Date: {new Date(currentReservation.date).toLocaleDateString()}</p>
                            <p>Time: {currentReservation.slot}</p>
                            <p>Number of People: {currentReservation.people}</p>
                        </div>

                        <div className="modal-actions">
                            <button type="submit" className="save-btn" disabled={loading}>
                                {loading ? 'Swapping...' : 'Confirm Swap'}
                            </button>
                            <button type="button" onClick={onClose} className="cancel-btn">
                                Cancel
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SwapBookingModal;