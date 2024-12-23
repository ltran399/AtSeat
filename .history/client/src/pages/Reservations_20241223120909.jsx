import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import ReservationCard from '../components/ReservationCard';
import Navbar from '../components/Navbar';
import "../styles/reservation.scss";
import { reservationAPI, API_BASE_URL } from '../config/api';

const Reservations = ({ type }) => {
    const [reservations, setReservations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext);

    console.log('Component Props:', { type }); // Debug prop
    console.log('User Context:', user); // Debug user context

    const fetchReservations = async () => {
        try {
            setLoading(true);
            let response;
            
            // Add immediate logging to see what path we're taking
            console.log('Fetching reservations with type:', type);
            
            if (type === "admin") {
                console.log('Admin path - checking user:', {
                    hasUser: !!user,
                    hasRestId: !!user?.rest,
                    restId: user?.rest
                });
                
                if (!user?.rest) {
                    throw new Error('Admin user does not have a restaurant ID');
                }
                
                const requestUrl = `${API_BASE_URL}/reservations/rest/${user.rest}`;
                console.log('Making request to:', requestUrl);
                
                response = await reservationAPI.getRestaurantReservations(user.rest);
                console.log('Received response:', response.data);
            } else {
                console.log('User path - making request for user:', user?._id);
                response = await reservationAPI.getUserReservations(user._id);
            }
            
            setReservations(response.data);
        } catch (err) {
            console.error('Error in fetchReservations:', {
                message: err.message,
                responseData: err.response?.data,
                responseStatus: err.response?.status,
                requestConfig: err.config
            });
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
                <h2>Reservations {type === "admin" ? "for Restaurant" : "for User"}</h2>
                <pre style={{padding: '10px', background: '#f5f5f5'}}>
                    Debug Info:
                    Type: {type}
                    User ID: {user?._id}
                    Rest ID: {user?.rest}
                </pre>
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