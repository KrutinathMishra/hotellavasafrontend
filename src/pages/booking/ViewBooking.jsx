import React, { useState, useEffect, useContext } from "react";
import "./BookingStyle.css";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { GlobalState } from "../../GlobalState";

const ViewBooking = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const navigate = useNavigate();
  const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [bookingData, setBookingData] = useState({
    booking_id: "",
    booked_on: "",
    booking_status: "",
    customer_firstname: "",
    customer_middlename: "",
    customer_lastname: "",
    customer_contact: "",
    booking_date: "",
    checkin_date: "",
    checkout_date: "",
    room_number: "",
    room_price: "",
    customer_ids: [],
    advance_amount: "",
    food_amount: "",
    other_expenses: "",
  });

  const [numberOfCustomers, setNumberOfCustomers] = useState();
  const [customerData, setCustomerData] = useState([
    {
      customer_id: "",
      first_name: "",
      middle_name: "",
      last_name: "",
      customer_email: "",
      phone_no: "",
      dob: "",
    },
  ]);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    if (!token) {
      console.log("token not found");
      return;
    }
    const fetchData = async () => {
      try {
        const [roomsRes, bookingsRes, customersRes] = await Promise.all([
          axios.get("/room", {
            headers: { Authorization: token },
          }),
          axios.get("/booking", {
            headers: { Authorization: token },
          }),
          axios.get("/customer", {
            headers: { Authorization: token },
          }),
        ]);

        const sortedRooms = roomsRes.data.sort(
          (a, b) => parseInt(a.room_number) - parseInt(b.room_number)
        );
        const sortedBookings = bookingsRes.data.sort(
          (a, b) =>
            parseInt(a.booking_id.substring(2)) -
            parseInt(b.booking_id.substring(2))
        );
        const sortedCustomers = customersRes.data.sort(
          (a, b) =>
            parseInt(a.customer_id.substring(3)) -
            parseInt(b.customer_id.substring(3))
        );

        setRooms(sortedRooms);
        setBookings(sortedBookings);
        setCustomers(sortedCustomers);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      const selectedBooking = bookings.find(
        (booking) => booking.booking_id === id
      );
      if (selectedBooking) {
        setBookingData({
          booking_id: selectedBooking.booking_id,
          booked_on: selectedBooking.booked_on,
          booking_status: selectedBooking.booking_status,
          customer_firstname: selectedBooking.customer_firstname,
          customer_middlename: selectedBooking.customer_middlename,
          customer_lastname: selectedBooking.customer_lastname,
          customer_contact: selectedBooking.customer_contact,
          booking_date: formatDate(new Date(selectedBooking.booking_date)),
          checkin_date: formatDate(new Date(selectedBooking.checkin_date)),
          checkout_date: formatDate(new Date(selectedBooking.checkout_date)),
          room_number: selectedBooking.room_number,
          room_price: selectedBooking.room_price,
          customer_ids: selectedBooking.customer_ids,
          advance_amount: selectedBooking.advance_amount,
          food_amount: selectedBooking.food_amount,
          other_expenses: selectedBooking.other_expenses,
        });

        const fetchCustomerData = async () => {
          try {
            const customerDataPromises = selectedBooking.customer_ids.map(
              (customerId) => {
                const customer = customers.find(
                  (c) => c.customer_id === customerId
                );

                return customer ? { ...customer } : null;
              }
            );

            const fetchedCustomerData = await Promise.all(customerDataPromises);
            setCustomerData(fetchedCustomerData.filter(Boolean)); // Filter out null values
            setNumberOfCustomers(selectedBooking.customer_ids.length);
          } catch (error) {
            console.error("Error fetching customer data:", error);
          }
        };

        fetchCustomerData();
      }
      setLoading(false);
    }
  }, [bookings, id]);

  return (
    <div className="booking-page-container">
      <div className="booking-page-heading">
        <h2>Booking Details</h2>
        <button
          className="add-booking-button"
          onClick={() => navigate("/admin/booking")}
        >
          All Bookings
        </button>
      </div>
      <div className="booking-page-content">
        <form className="booking-form">
          <div className="booking-flex-div">
            <div className="booking-single-inputs">
              <span className="heading-span">Booking ID: </span>
              <span className="readonly-spans">{bookingData.booking_id}</span>
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Booked On:</span>
              <span className="readonly-spans">{bookingData.booked_on}</span>
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Booking Status:</span>
              <span className="readonly-spans">
                {bookingData.booking_status}
              </span>
            </div>
          </div>
          {bookingData.booking_status === "Reserved" && (
            <div className="booking-flex-div">
              <div className="booking-single-inputs">
                <span className="heading-span">First Name: </span>
                <span className="readonly-spans">
                  {bookingData.customer_firstname}
                </span>
              </div>
              <div className="booking-single-inputs">
                <span className="heading-span">Middle Name: </span>
                <span className="readonly-spans">
                  {bookingData.customer_middlename}
                </span>
              </div>
              <div className="booking-single-inputs">
                <span className="heading-span">Last Name: </span>
                <span className="readonly-spans">
                  {bookingData.customer_lastname}
                </span>
              </div>
            </div>
          )}
          {bookingData.booking_status === "Reserved" && (
            <div className="booking-flex-div">
              <div className="booking-single-inputs">
                <span>Contact Number: </span>
                <span className="readonly-spans">
                  {bookingData.customer_contact}
                </span>
              </div>
            </div>
          )}
          <div className="booking-flex-div">
            <div className="booking-single-inputs">
              <span className="heading-span">Booking Date: </span>
              <span className="readonly-spans">{bookingData.booking_date}</span>
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Check-in Date: </span>
              <span className="readonly-spans">{bookingData.checkin_date}</span>
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Check-out Date:</span>
              <span className="readonly-spans">
                {bookingData.checkout_date}
              </span>
            </div>
          </div>
          <div className="booking-flex-div">
            <div className="booking-single-inputs">
              <span className="heading-span">Room No: </span>
              <span className="readonly-spans">{bookingData.room_number}</span>
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Room Price: </span>
              <span className="readonly-spans">{bookingData.room_price}</span>
            </div>
          </div>
          <div className="booking-flex-div">
            <div className="booking-single-inputs">
              <span className="heading-span">Advance Amount: </span>
              <span className="readonly-spans">
                {bookingData.advance_amount}
              </span>
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Food Amount: </span>
              <span className="readonly-spans">{bookingData.food_amount}</span>
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Other Expenses: </span>
              <span className="readonly-spans">
                {bookingData.other_expenses}
              </span>
            </div>
          </div>
        </form>

        {(bookingData.booking_status == "Checked In" ||
          bookingData.booking_status == "Checked Out") && (
          <div className="booking-flex-div">
            <h2 className="cust-details-heading">Customer details</h2>
          </div>
        )}

        {(bookingData.booking_status == "Checked In" ||
          bookingData.booking_status == "Checked Out") && (
          <div>
            {customerData.map((customer, index) => (
              <form className="booking-form" key={index}>
                <div className="booking-flex-div">
                  <div className="single-input">
                    <span className="customer-entry-heading">
                      Customer {index + 1}{" "}
                    </span>
                  </div>
                </div>
                <div className="customer-entry-div">
                  <div className="booking-flex-div">
                    <div className="booking-single-inputs">
                      <span className="heading-span">First Name: </span>
                      <span className="readonly-spans">
                        {customer.first_name}
                      </span>
                    </div>
                    <div className="booking-single-inputs">
                      <span className="heading-span">Middle Name: </span>
                      <span className="readonly-spans">
                        {customer.middle_name}
                      </span>
                    </div>
                    <div className="booking-single-inputs">
                      <span className="heading-span">Last Name: </span>
                      <span className="readonly-spans">
                        {customer.last_name}
                      </span>
                    </div>
                  </div>
                  <div className="booking-flex-div">
                    <div className="booking-single-inputs">
                      <span className="heading-span">Email: </span>
                      <span className="readonly-spans">
                        {customer.customer_email}
                      </span>
                    </div>
                    <div className="booking-single-inputs">
                      <span className="heading-span">Phone No: </span>
                      <span className="readonly-spans">
                        {customer.phone_no}
                      </span>
                    </div>
                    <div className="booking-single-inputs">
                      <span className="heading-span">Date of Birth: </span>
                      <span className="readonly-spans">{customer.dob}</span>
                    </div>
                  </div>
                </div>
              </form>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewBooking;
