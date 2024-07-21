// components/Booking/BookingList.tsx
"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import formatDate from "@/utils/formatDate";

// Fonction pour récupérer les données de réservation
const fetchBookings = async () => {
  const { data } = await axios.get("/api/bookings");
  return data;
};

// Composant BookingList
const BookingList: React.FC = () => {
  const {
    data: bookings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching bookings.</div>;

  return (
    <div>
      <br />
      <hr />
      <h2 className="font-bold text-xl my-4">Liste des Réservations</h2>
      {bookings.length === 0 ? (
        <p>Aucune réservation trouvée.</p>
      ) : (
        <ul>
          {bookings.map(
            (
              booking: {
                name: string;
                id: number;
                startDate: string;
                endDate: string;
              },
              index: number
            ) => (
              <li
                key={booking.id}
                className={`border-b p-2 ${
                  index % 2 === 1 ? "bg-slate-50" : ""
                } ${index === 0 ? "border-t" : ""}`}
              >
                <div className="font-bold">{booking.name}</div>
                {format(new Date(booking.startDate), "d MMMM yyyy", {
                  locale: fr,
                })}{" "}
                au{" "}
                {format(new Date(booking.endDate), "d MMMM yyyy", {
                  locale: fr,
                })}
                <div className="text-xs opacity-80">
                  {" "}
                  Date d'ajout : {formatDate(new Date(booking.createdAt))}
                </div>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
};

export default BookingList;
