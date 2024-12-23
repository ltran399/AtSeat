// client/src/pages/Reservations.jsx

import React, { useContext } from 'react'
import useFetch from '../useFetch'
import { AuthContext } from '../authContext'
import ReservationCard from '../components/ReservationCard'
import Navbar from '../components/Navbar'
import "../styles/reservation.scss"

const Reservations = ({type}) => {

  const { user } = useContext(AuthContext)

  const urls = {
    "admin": `/reservations/rest/${user.rest}`,
    "user": `/reservations/user/${user._id}`
  }

  // Call useFetch unconditionally
  const {data} = useFetch(urls[type])

  return (
    <div>
        <Navbar />
        <div className="reservation-container">
        {data ? (
          data?.map((item, index) => (
            <ReservationCard key={index} props={{...item, type}} />
          ))
        ) : (
          "No Reservations Yet"
        )}
        </div>
    </div>
  )
}

export default Reservations