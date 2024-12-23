// client/src/components/ModifyReservationModal.jsx

import React, { useState } from 'react';
import axios from 'axios';
import "../styles/modifyReservationModal.scss";

const ModifyReservationModal = ({ reservation, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        date: reservation.date.substring(0, 10),
        slot: reservation.slot,
        people: reservation.people
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:7700/api/reservations/${reservation._id}`,
                formData,
                { withCredentials: false }
            );
            onUpdate(response.data);
            onClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Modify Reservation</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Date:</label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({...formData, date: e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label>Time:</label>
                        <select
                            value={formData.slot}
                            onChange={(e) => setFormData({...formData, slot: e.target.value})}
                        >
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="18:00">18:00</option>
                            <option value="19:00">19:00</option>
                            <option value="20:00">20:00</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Number of People:</label>
                        <input
                            type="number"
                            min="1"
                            max="10"
                            value={formData.people}
                            onChange={(e) => setFormData({...formData, people: e.target.value})}
                        />
                    </div>
                    <div className="modal-actions">
                        <button type="submit" className="save-btn">Save Changes</button>
                        <button type="button" onClick={onClose} className="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ModifyReservationModal;