// client/src/ModifyReservationModal.jsx

import React, { useState } from 'react';
import axios from 'axios';
import "../styles/modal.scss";

const ModifyReservationModal = ({ reservation, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        date: reservation.date.substring(0, 10),
        slot: reservation.slot,
        people: reservation.people
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            const response = await axios.put(
                `http://localhost:7700/api/reservations/${reservation._id}`,
                formData,
                { withCredentials: false }
            );
            onUpdate(response.data);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Error updating reservation");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <h2>Modify Reservation</h2>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                            min={new Date().toISOString().split('T')[0]}
                        />
                    </div>
                    <div className="form-group">
                        <label>Time:</label>
                        <select
                            value={formData.slot}
                            onChange={(e) => setFormData({...formData, slot: e.target.value})}
                        >
                            <option value="12:00 PM - 01:00 PM">12:00 PM - 01:00 PM</option>
                            <option value="01:00 PM - 02:00 PM">01:00 PM - 02:00 PM</option>
                            <option value="02:00 PM - 03:00 PM">02:00 PM - 03:00 PM</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Number of People:</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.people}
                            onChange={(e) => setFormData({...formData, people: parseInt(e.target.value)})}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" onClick={onClose} className="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModifyReservationModal;