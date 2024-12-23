import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
    faMoneyBill,
    faLocationDot,
    faThumbsUp,
    faPhone
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate, useParams} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/restaurant.scss";
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AuthContext } from '../authContext';
import { restaurantAPI, reservationAPI } from '../config/api';

const Restaurant = ({ type }) => {
  const [date, setDate] = useState("");
  const [data, setData] = useState({});
  const [slots, setSlots] = useState([]);
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewState, setViewState] = useState({
      latitude: 37.8,
      longitude: -122.4,
      zoom: 12
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // Use useParams to get the ID

  // Debug log to check path and ID
  console.log("Current path:", location.pathname);
  console.log("Restaurant ID:", id);

  // Fetch restaurant data
  useEffect(() => {
      const fetchRestaurant = async () => {
          try {
              if (!id) {
                  setError("Restaurant ID is missing");
                  setLoading(false);
                  return;
              }

              setLoading(true);
              setError(null);
              console.log("Fetching restaurant with ID:", id);
              const response = await restaurantAPI.getById(id);
              console.log("Restaurant data received:", response.data);
              setData(response.data);
          } catch (err) {
              console.error("Error details:", {
                  message: err.message,
                  status: err.response?.status,
                  data: err.response?.data,
                  id: id
              });
              setError(err.response?.data?.message || err.message);
          } finally {
              setLoading(false);
          }
      };

      fetchRestaurant();
  }, [id]);

    // Fetch slots when date changes
    useEffect(() => {
        const fetchSlots = async () => {
            if (date) {
                try {
                    const response = await reservationAPI.getSlots(id, date);
                    setSlots(response.data);
                } catch (err) {
                    console.error("Error fetching slots:", err);
                    setError(err.response?.data?.message || err.message);
                }
            }
        };
        fetchSlots();
    }, [date, id]);

    useEffect(() => {
        if (data?.location) {
            getPlaces();
        }
    }, [data]);

    const handleChange = (e) => {
        setInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        try {
            const newRes = {
                ...info,
                author: user._id,
                rest: id,
                date: date
            };
            
            await reservationAPI.create(newRes);
            navigate('/reservations');
        } catch (err) {
            console.error("Error creating reservation:", err);
            setError(err.response?.data?.message || err.message);
        }
    };

    const getPlaces = async () => {
        try {
            const promise = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${data.location}.json?access_token=${process.env.REACT_APP_API_MAPBOX_KEY}`
            );
            const placesData = await promise.json();
            if (placesData.features.length > 0) {
                const firstPlace = placesData.features[0];
                const { center } = firstPlace;
                setViewState(prev => ({
                    ...prev,
                    latitude: center[1],
                    longitude: center[0],
                }));
            }
        } catch (err) {
            console.error("Error fetching location:", err);
            setError(err.message);
        }
    };

    if (loading) return (
        <div className="restaurant">
            <Navbar />
            <div className="loading">Loading...</div>
        </div>
    );

    if (error) return (
        <div className="restaurant">
            <Navbar />
            <div className="error">Error: {error}</div>
        </div>
    );

    return (
        <div className='restaurant'>
            <Navbar />
            <div className="rest-container">
                <div className="leftContainer">
                    <h1>{data.name}</h1>
                    <p>{data.description}</p>

                    <div className="other-details">
                        <div className="location">
                            <span><FontAwesomeIcon icon={faLocationDot} /> Location: </span>
                            {data.location}
                        </div>
                        <div className="rating">
                            <span><FontAwesomeIcon icon={faThumbsUp} /> Rating: </span>
                            {data.rating}
                        </div>
                        <div className="price">
                            <span><FontAwesomeIcon icon={faMoneyBill} /> Price Range: </span>
                            {data.price}
                        </div>
                        <div className="contact">
                            <span><FontAwesomeIcon icon={faPhone} /> Contact: </span>
                            {data.contact}
                        </div>
                    </div>

                    {!user?.isAdmin && (
                        <div className="reservation-box">
                            <div className="form-input">
                                <label htmlFor="date">Date</label>
                                <input 
                                    type="date" 
                                    onChange={(e) => setDate(e.target.value)} 
                                    id='date'
                                />
                            </div>
                            {date && (
                                <div className="form-input">
                                    <label htmlFor="slot">Time</label>
                                    <select id="slot" onChange={handleChange}>
                                        <option value="none">-</option>
                                        {slots?.map((s, index) => (
                                            <option key={index} value={s}>{s}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="form-input">
                                <label htmlFor="people">People</label>
                                <input 
                                    type="number" 
                                    id='people' 
                                    onChange={handleChange}
                                />
                            </div>
                            <button onClick={handleClick}>Make Reservation</button>
                        </div>
                    )}
                </div>

                <div className="rightContainer">
                    <div className="location-map">
                        <Map
                            {...viewState}
                            onMove={evt => setViewState(evt.viewState)}
                            style={{width: 400, height: 300}}
                            mapStyle="mapbox://styles/mapbox/streets-v9"
                            mapboxAccessToken={process.env.REACT_APP_API_MAPBOX_KEY}
                        >
                            <Marker 
                                longitude={viewState.longitude} 
                                latitude={viewState.latitude} 
                                color="red" 
                            />
                        </Map>
                    </div>

                    <div className="imgSlider">
                        <div className="images">
                            <img src={data.photo} height="300px" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;