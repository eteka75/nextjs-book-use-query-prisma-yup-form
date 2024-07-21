// components/BookingSection.tsx
"use client";

import BookingForm from "@/components/Booking/BookingForm";
import BookingList from "@/components/Booking/BookingList";
import React, { useState } from "react";

const BookingSection: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey((prevKey) => prevKey + 1); // Incrémente la clé pour rafraîchir la liste
  };

  return (
    <div className="mx-auto p-4 max-w-4xl">
      <h1 className="font-bold text-2xl mb-6">Booking Section</h1>
      <BookingForm onSuccess={handleSuccess} />
      <BookingList key={refreshKey} />
    </div>
  );
};

export default BookingSection;
