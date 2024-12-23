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

    // Add these new API endpoints to your config/api.js file
    const fetchReservations = async () => {
      try {
          setLoading(true);
          let response;
          
          if (type === "admin") {
              // Debug logging
              console.log('Admin reservation request:');
              console.log('- Type:', type);
              console.log('- User:', user);
              console.log('- Restaurant ID:', user?.rest);
              console.log('- API URL:', `${API_BASE_URL}/reservations/rest/${user?.rest}`);
              
              if (!user?.rest) {
                  throw new Error('Admin user does not have a restaurant ID');
              }
              
              response = await reservationAPI.getRestaurantReservations(user.rest);
              console.log('- Response:', response);
          } else {
              response = await reservationAPI.getUserReservations(user._id);
          }
          
          setReservations(response.data);
      } catch (err) {
          console.error('Reservation fetch error:', {
              message: err.message,
              status: err.response?.status,
              data: err.response?.data,
              config: err.config // This will show the actual request configuration
          });
          setError(err.message || 'Failed to fetch reservations');
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
      console.log('Reservations component mounted:', { type, user });
      fetchReservations();
  }, [type, user]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Navbar />
            <div className="reservation-container">
                {reservations.length > 0 ? (
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