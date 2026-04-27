import React, { createContext, useContext, useState } from "react";

const BookingContext = createContext({});
export const useBooking = () => useContext(BookingContext);

export const BookingProvider = ({ children }) => {
  const [booking, setBooking] = useState({
    destination: null, type: null, dates: { start: null, end: null },
    guests: 1, promoCode: "", totalPrice: 0,
  });

  const updateBooking = (data) => setBooking((prev) => ({ ...prev, ...data }));
  const resetBooking = () => setBooking({ destination: null, type: null, dates: { start: null, end: null }, guests: 1, promoCode: "", totalPrice: 0 });

  return (
    <BookingContext.Provider value={{ booking, updateBooking, resetBooking }}>
      {children}
    </BookingContext.Provider>
  );
};
