import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import ReservationCard from '../components/ReservationCard';
import Navbar from '../components/Navbar';
import "../styles/reservation.scss";
import { reservationAPI } from '../config/api';

const Reservations = ({ type }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    const fetchReservations = async () => {
        try {
            setLoading(true);
            let response;
            
            if (type === "admin") {
                if (!user?.rest) {
                    throw new Error('Admin user does not have a restaurant ID');
                }
                response = await reservationAPI.getRestaurantReservations(user.rest);
            } else {
                response = await reservationAPI.getUserReservations(user._id);
            }
            
            setReservations(response.data);
        } catch (err) {
            setError(err.message || 'Failed to fetch reservations');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservations();
    }, [type, user]);

    return (
        <div>
            <Navbar />
            <div className="reservation-container">
                {loading ? (
                    <div>Loading...</div>
                ) : error ? (
                    <div>Error: {error}</div>
                ) : reservations.length > 0 ? (
                    reservations.map((item, index) => (
                        <ReservationCard 
                            key={index} 
                            props={{...item, type}} 
                        />
                    ))
                ) : (
                    "No Reservations Yet"
                )}
            </div>
        </div>
    );
};

export default Reservations;