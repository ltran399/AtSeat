// client/src/ReservationCard.jsx

import React, { useState } from 'react';
import "../styles/reservationCard.scss";
import { faTrash, faPenToSquare, faArrowRightArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from 'react-router-dom';
import axios from 'axios';
import ModifyReservationModal from './ModifyReservationModal';
import SwapBookingModal from './SwapBookingModal';

const ReservationCard = ({props}) => {
    console.log("Props type:", props.type); // Add this line
    const [showModifyModal, setShowModifyModal] = useState(false);
    const [showSwapModal, setShowSwapModal] = useState(false);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this reservation?')) {
            try {
                await axios.delete(`http://localhost:7700/api/reservations/${props._id}`, { withCredentials: false });
                window.location.reload();
            } catch(err) {
                console.log(err);
            }
        }
    };

    const handleUpdate = (updatedReservation) => {
        window.location.reload();
    };

    const handleSwap = (swappedReservation) => {
        window.location.reload();
    };

    return (
        <>
            <div className='reservation-card'>
                <div className="details">
                    <div className="res-name">
                        <h1>{props.rest.name}</h1>
                        {props.type === "User" && 
                            <Link to={`/restaurant/${props.rest._id}`}>
                                <button>View</button>
                            </Link>
                        }
                    </div>
                    <div className='res-details'>
                        <p>Date: </p> 
                        <span>{props.date.substring(0, 10)}</span> 
                        <p>Time: </p> 
                        <span>{props.slot}</span> 
                        <p>People: </p> 
                        <span>{props.people}</span>
                    </div>
                </div>
                
                {props.type === "admin" ? (
                    <div className="admin-actions">
                        <FontAwesomeIcon 
                            icon={faPenToSquare} 
                            onClick={() => setShowModifyModal(true)}
                            className="action-icon"
                            title="Modify"
                        />
                        <FontAwesomeIcon 
                            icon={faArrowRightArrowLeft} 
                            onClick={() => setShowSwapModal(true)}
                            className="action-icon"
                            title="Swap Booking"
                        />
                        <FontAwesomeIcon 
                            icon={faTrash} 
                            onClick={handleDelete}
                            className="action-icon"
                            title="Delete"
                        />
                    </div>
                ) : props.type === "User" && (
                    <div className="icon">
                        <FontAwesomeIcon icon={faTrash} onClick={handleDelete}/>
                    </div>
                )}
            </div>

            {showModifyModal && (
                <ModifyReservationModal
                    reservation={props}
                    onClose={() => setShowModifyModal(false)}
                    onUpdate={handleUpdate}
                />
            )}

            {showSwapModal && (
                <SwapBookingModal
                    currentReservation={props}
                    onClose={() => setShowSwapModal(false)}
                    onSwap={handleSwap}
                />
            )}
        </>
    );
};

export default ReservationCard;