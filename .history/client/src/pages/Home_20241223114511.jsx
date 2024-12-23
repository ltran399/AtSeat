import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import '../styles/home.scss';
import Card from '../components/Card';
import { restaurantAPI } from '../config/api';

const Home = () => {
    const [query, setQuery] = useState("");
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const keys = ["name", "location"];

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                setLoading(true);
                const response = await restaurantAPI.getAll();
                setRestaurants(response.data);
            } catch (err) {
                console.error("Error fetching restaurants:", err);
                setError(err.message || "Failed to fetch restaurants");
            } finally {
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    const search = (data) => {
        if (!query) return data;
        return data.filter((item) =>
            keys.some((key) => item[key] && 
                item[key].toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    if (error) {
        return (
            <div className="home">
                <Navbar />
                <div className="error-message">
                    Error loading restaurants: {error}
                </div>
            </div>
        );
    }

    return (
        <div className='home'>
            <Navbar />
            <div className="search">
                <div className="searchBar">
                    <h2>Explore</h2>
                    <div className="searchInput">
                        <input
                            type="text"
                            placeholder="Search places or restaurants"
                            onChange={(e) => setQuery(e.target.value)}
                            value={query}
                        />
                        <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
                    </div>
                </div>
            </div>

            <div className="searchedPosts">
                {loading ? (
                    <div 
                        className="p" 
                        style={{
                            color: "white", 
                            fontFamily: "'Kaushan Script', cursive"
                        }}
                    >
                        Loading...
                    </div>
                ) : (
                    search(restaurants)?.map((item, i) => (
                        <Card
                            key={item._id || i}
                            _id={item._id}
                            photo={item.photo}
                            name={item.name}
                            location={item.location}
                            rating={item.rating}
                        />
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;