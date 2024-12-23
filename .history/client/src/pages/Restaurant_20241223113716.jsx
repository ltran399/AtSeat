import React, { useContext, useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import {
    faMoneyBill,
    faLocationDot,
    faThumbsUp,
    faPhone
} from "@fortawesome/free-solid-svg-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/restaurant.scss";
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { AuthContext } from '../authContext';
import { restaurantAPI, reservationAPI } from '../config/api';

const Restaurant = ({ type }) => {
    const [date, setDate] = useState("");
    const [restaurantData, setRestaurantData] = useState(null);
    const [slots, setSlots] = useState([]);
    const [info, setInfo] = useState({});
    const [viewState, setViewState] = useState({
        latitude: 37.8,
        longitude: -122.4,
        zoom: 12
    });

    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    
    const id = type === "user" ? location.pathname.split("/")[2] : location.pathname.split("/")[3];

    // Fetch restaurant data
    useEffect(() => {
        const fetchRestaurantData = async () => {
            try {
                const response = await restaurantAPI.getById(id);
                setRestaurantData(response.data);
            } catch (err) {
                console.error("Error fetching restaurant:", err);
            }
        };
        fetchRestaurantData();
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
                }
            }
        };
        fetchSlots();
    }, [date, id]);

    // Update map when restaurant data changes
    useEffect(() => {
        if (restaurantData?.location) {
            getPlaces();
        }
    }, [restaurantData]);

    const handleChange = (e) => {
        setInfo(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleClick = async (e) => {
        e.preventDefault();
        const newRes = {
            ...info,
            author: user._id,
            rest: id,
            date: date
        };
        
        try {
            await reservationAPI.create(newRes);
            navigate('/reservations');
        } catch (err) {
            console.error("Error creating reservation:", err);
        }
    };

    const getPlaces = async () => {
        try {
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${restaurantData.location}.json?access_token=${process.env.REACT_APP_API_MAPBOX_KEY}`
            );
            const placesData = await response.json();
            
            if (placesData.features.length > 0) {
                const [longitude, latitude] = placesData.features[0].center;
                setViewState(prev => ({
                    ...prev,
                    latitude,
                    longitude
                }));
            }
        } catch (err) {
            console.error("Error fetching location:", err);
        }
    };

    if (!restaurantData) return <div>Loading...</div>;

    return (
        <div className='restaurant'>
            <Navbar />
            <div className="rest-container">
                <div className="leftContainer">
                    <h1>{restaurantData.name}</h1>
                    <p>{restaurantData.description}</p>

                    <div className="other-details">
                        <div className="location">
                            <span><FontAwesomeIcon icon={faLocationDot} /> Location: </span>
                            {restaurantData.location}
                        </div>
                        <div className="rating">
                            <span><FontAwesomeIcon icon={faThumbsUp} /> Rating: </span>
                            {restaurantData.rating}
                        </div>
                        <div className="price">
                            <span><FontAwesomeIcon icon={faMoneyBill} /> Price Range: </span>
                            {restaurantData.price}
                        </div>
                        <div className="contact">
                            <span><FontAwesomeIcon icon={faPhone} /> Contact: </span>
                            {restaurantData.contact}
                        </div>
                    </div>

                    {!user.isAdmin && (
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
                                        {slots.map((s, index) => (
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
                            <img src={restaurantData.photo} height="300px" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Restaurant;