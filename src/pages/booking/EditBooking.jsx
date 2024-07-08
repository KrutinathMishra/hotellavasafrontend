import React, { useState, useEffect, useContext } from "react";
import "./BookingStyle.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { GlobalState } from "../../GlobalState";

const EditBooking = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const { id } = useParams();
  const [customers, setCustomers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [availableRooms, setAvailableRooms] = useState([]);

  const [booking, setBooking] = useState({
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

    return `${year}-${month}-${day}`;
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
        setBooking({
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

  const getNextCustomerId = (index) => {
    if (!loading && customers.length > 0) {
      const lastCustomerId = customers[customers.length - 1].customer_id;
      const nextId = parseInt(lastCustomerId.substring(3)) + 1 + index;

      return `CUS${String(nextId).padStart(5, "0")}`;
    }
  };

  // FETCHING AND SETTING DATA COMPLETE

  useEffect(() => {
    if (numberOfCustomers !== customerData.length) {
      const newCustomerData = Array.from(
        { length: numberOfCustomers },
        (_, i) => ({
          customer_id: customerData[i]?.customer_id || getNextCustomerId(i),
          first_name:
            i === 0
              ? bookingData.customer_firstname
              : customerData[i]?.first_name || "",
          middle_name:
            i === 0
              ? bookingData.customer_middlename
              : customerData[i]?.middle_name || "",
          last_name:
            i === 0
              ? bookingData.customer_lastname
              : customerData[i]?.last_name || "",
          customer_email: customerData[i]?.customer_email || "",
          phone_no:
            i === 0
              ? bookingData.customer_contact
              : customerData[i]?.phone_no || "",
          dob: customerData[i]?.dob || "",
        })
      );
      setCustomerData(newCustomerData);

      const newCustomerIds = newCustomerData.map(
        (customer) => customer.customer_id
      );
      setBookingData((prev) => ({
        ...prev,
        customer_ids: newCustomerIds,
      }));
    }
  }, [numberOfCustomers]);

  useEffect(() => {
    if (bookingData.booking_status == "Reserved") {
      setCustomerData([]);
      setNumberOfCustomers(0);
      setBookingData((prev) => ({
        ...prev,
        customer_ids: [],
      }));
    }
  }, [bookingData.booking_status]);

  useEffect(() => {
    if (!loading) {
      updateAvailableRooms();
      dateValidation();
    }
  }, [bookingData.checkin_date, bookingData.checkout_date, bookings, rooms]);

  const updateAvailableRooms = () => {
    const specificRoomNumber = booking.room_number;
    if (bookingData.checkin_date && bookingData.checkout_date) {
      const available = rooms.filter((room) => {
        if (room.room_number === specificRoomNumber) {
          return true;
        }
        return !bookings.some((booking) => {
          const bookingCheckIn = new Date(booking.checkin_date);
          const bookingCheckOut = new Date(booking.checkout_date);
          const checkinDate = new Date(bookingData.checkin_date);
          const checkoutDate = new Date(bookingData.checkout_date);

          return (
            booking.booking_status !== "Checked Out" &&
            booking.room_number === room.room_number &&
            ((checkinDate >= bookingCheckIn && checkinDate < bookingCheckOut) ||
              (checkoutDate > bookingCheckIn &&
                checkoutDate <= bookingCheckOut) ||
              (checkinDate <= bookingCheckIn &&
                checkoutDate >= bookingCheckOut - 1))
          );
        });
      });
      setAvailableRooms(available);
    }
  };

  const dateValidation = () => {
    if (bookingData.checkin_date && bookingData.checkout_date) {
      if (bookingData.checkout_date < bookingData.checkin_date) {
        toast.error("Checkout date is before Checkin date");
        setBookingData((prev) => ({
          ...prev,
          checkin_date: "",
          checkout_date: "",
        }));
      }
    }
  };

  const handleCustomerChange = (index, field, value) => {
    setCustomerData((prev) =>
      prev.map((customer, i) =>
        i === index ? { ...customer, [field]: value } : customer
      )
    );
  };

  const handleBookingSubmit = async () => {
    if (!token) {
      console.log("token not found");
      return;
    }
    if (!bookingData.booking_status) {
      toast.error("Booking Status is required.");
      return;
    }
    if (
      !bookingData.customer_firstname &&
      bookingData.booking_status === "Reserved"
    ) {
      toast.error("First Name is required(Reservation).");
      return;
    }
    if (
      !bookingData.customer_lastname &&
      bookingData.booking_status === "Reserved"
    ) {
      toast.error("Last Name is required(Reservation).");
      return;
    }
    if (
      !bookingData.customer_contact &&
      bookingData.booking_status === "Reserved"
    ) {
      toast.error("Contact Number is required.");
      return;
    }
    if (!bookingData.checkin_date) {
      toast.error("Check In date is required.");
      return;
    }
    if (!bookingData.checkout_date) {
      toast.error("Check Out date is required.");
      return;
    }
    if (!bookingData.room_number) {
      toast.error("Room Number is required.");
      return;
    }
    if (!bookingData.room_price) {
      toast.error("Room Price is required.");
      return;
    }
    if (bookingData.booking_status != "Reserved" && !bookingData.customer_ids) {
      toast.error("Customer Id is required.(Non Reservation");
      return;
    }
    if (bookingData.booking_status != "Reserved") {
      for (let i = 0; i < numberOfCustomers; i++) {
        if (!customerData[i].first_name || !customerData[i].last_name) {
          toast.error("Please fill in all required fields.");
          return;
        }
      }
    }

    if (bookingData.booking_status != "Reserved") {
      for (let i = 0; i < numberOfCustomers; i++) {
        if (booking.customer_ids.includes(customerData[i].customer_id)) {
          const {
            customer_id,
            first_name,
            middle_name,
            last_name,
            customer_email,
            phone_no,
            dob,
          } = customerData[i];

          try {
            const response = await axios.put(`/customer/${customer_id}`, {
              first_name,
              middle_name,
              last_name,
              customer_email,
              phone_no,
              dob,
            });
            if (response.data.error) {
              toast.error(response.data.error);
            } else {
              toast.success(`Customer ${i + 1} Update Successful.`);
            }
          } catch (error) {
            console.log(error);
          }
        } else {
          const {
            customer_id,
            first_name,
            middle_name,
            last_name,
            customer_email,
            phone_no,
            dob,
          } = customerData[i];

          try {
            const response = await axios.post(
              "/customer",
              {
                customer_id,
                first_name,
                middle_name,
                last_name,
                customer_email,
                phone_no,
                dob,
              },
              {
                headers: { Authorization: token },
              }
            );
            if (response.data.error) {
              toast.error(response.data.error);
            } else {
              toast.success(`Customer ${i + 1} Add Successful.`);
            }
          } catch (error) {
            console.log(error);
          }
        }
      }
    }

    const {
      booked_on,
      booking_status,
      customer_firstname,
      customer_middlename,
      customer_lastname,
      customer_contact,
      booking_date,
      checkin_date,
      checkout_date,
      room_number,
      room_price,
      customer_ids,
      advance_amount,
      food_amount,
      other_expenses,
    } = bookingData;
    try {
      const response = await axios.put(
        `/booking/${bookingData.booking_id}`,
        {
          booked_on,
          booking_status,
          customer_firstname,
          customer_middlename,
          customer_lastname,
          customer_contact,
          booking_date,
          checkin_date,
          checkout_date,
          room_number,
          room_price,
          customer_ids,
          advance_amount,
          food_amount,
          other_expenses,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Booking Update Successful.");
        window.location.replace("/admin/booking");
      }
    } catch (error) {
      toast.error("Failed to update booking. Please try again.");
      console.log(error);
    }
  };

  return (
    <div className="booking-page-container">
      <div className="booking-page-heading">
        <h2>Edit Booking</h2>
      </div>
      <div className="booking-page-content">
        <form className="booking-form">
          <div className="booking-flex-div">
            <div className="booking-single-inputs">
              <span className="heading-span">Booking ID: </span>
              <span className="readonly-spans">{booking.booking_id}</span>
              {/* <input
                className="booking-form-input"
                type="text"
                name="booking_id"
                value={booking.booking_id}
                readOnly
              /> */}
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Booked On:</span>
              <span className="readonly-spans">{booking.booked_on}</span>
              {/* <input
                className="booking-form-input"
                type="text"
                name="booked_on"
                value={booking.booked_on}
                readOnly
              /> */}
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Booking Status:</span>
              <select
                className="booking-form-select"
                value={bookingData.booking_status}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    booking_status: e.target.value,
                  })
                }
              >
                {booking.booking_status == "Reserved" && (
                  <option value="Reserved">Reserved</option>
                )}
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
              </select>
              <span className="required-marker">
                <sup>*</sup>
              </span>
            </div>
          </div>
          {bookingData.booking_status === "Reserved" && (
            <div className="booking-flex-div">
              <div className="booking-single-inputs">
                <span className="heading-span">First Name: </span>
                <input
                  className="booking-form-input"
                  type="text"
                  name="customer_firstname"
                  value={bookingData.customer_firstname}
                  onChange={(e) => {
                    setBookingData({
                      ...bookingData,
                      customer_firstname: e.target.value,
                    });
                    setCustomerData((prev) => [
                      {
                        ...prev[0],
                        first_name: e.target.value,
                      },
                    ]);
                  }}
                />
                <span className="required-marker">
                  <sup>*</sup>
                </span>
              </div>
              <div className="booking-single-inputs">
                <span className="heading-span">Middle Name: </span>
                <input
                  className="booking-form-input"
                  type="text"
                  name="customer_middlename"
                  value={bookingData.customer_middlename}
                  onChange={(e) => {
                    setBookingData({
                      ...bookingData,
                      customer_middlename: e.target.value,
                    });
                    setCustomerData((prev) => [
                      {
                        ...prev[0],
                        middle_name: e.target.value,
                      },
                    ]);
                  }}
                />
              </div>
              <div className="booking-single-inputs">
                <span className="heading-span">Last Name: </span>
                <input
                  className="booking-form-input"
                  type="text"
                  name="customer_lastname"
                  value={bookingData.customer_lastname}
                  onChange={(e) => {
                    setBookingData({
                      ...bookingData,
                      customer_lastname: e.target.value,
                    });
                    setCustomerData((prev) => [
                      {
                        ...prev[0],
                        last_name: e.target.value,
                      },
                    ]);
                  }}
                />
                <span className="required-marker">
                  <sup>*</sup>
                </span>
              </div>
            </div>
          )}
          {bookingData.booking_status === "Reserved" && (
            <div className="booking-flex-div">
              <div className="booking-single-inputs">
                <span>Contact Number: </span>
                <input
                  className="booking-form-input"
                  type="Number"
                  name="customer_contact"
                  value={bookingData.customer_contact}
                  onChange={(e) => {
                    const { value } = e.target;
                    setBookingData({
                      ...bookingData,
                      customer_contact: value,
                    });
                    setCustomerData((prev) => [
                      {
                        ...prev[0],
                        phone_no: value, // Assuming you're updating phone_no in customerData
                      },
                    ]);
                  }}
                />
                <span className="required-marker">
                  <sup>*</sup>
                </span>
              </div>
            </div>
          )}
          <div className="booking-flex-div">
            <div className="booking-single-inputs">
              <span className="heading-span">Booking Date: </span>
              <span className="readonly-spans">{booking.booking_date}</span>
              {/* <input
                className="booking-form-input"
                type="date"
                name="booking_date"
                value={booking.booking_date}
                readOnly
              /> */}
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Check-in Date: </span>
              <DatePicker
                selected={bookingData.checkin_date}
                onChange={(date) => {
                  setBookingData({
                    ...bookingData,
                    checkin_date: formatDate(date),
                  });
                }}
                dateFormat="dd/MM/yyyy"
                className="date-picker-class booking-form-input"
              />
              <span className="required-marker">
                <sup>*</sup>
              </span>
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Check-out Date:</span>
              <DatePicker
                selected={bookingData.checkout_date}
                onChange={(date) => {
                  setBookingData({
                    ...bookingData,
                    checkout_date: formatDate(date),
                  });
                }}
                dateFormat="dd/MM/yyyy"
                className="date-picker-class booking-form-input"
              />
              <span className="required-marker">
                <sup>*</sup>
              </span>
            </div>
          </div>
          <div className="booking-flex-div">
            <div className="booking-single-inputs">
              <span className="heading-span">Room No: </span>
              <select
                className="booking-form-select"
                value={bookingData.room_number}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    room_number: e.target.value,
                  })
                }
              >
                <option value="">--Select--</option>
                {availableRooms.map((room) => (
                  <option key={room.room_number} value={room.room_number}>
                    {room.room_number}
                  </option>
                ))}
              </select>
              <span className="required-marker">
                <sup>*</sup>
              </span>
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Room Price: </span>
              <input
                className="booking-form-input"
                type="text"
                name="room_price"
                value={bookingData.room_price}
                onChange={(e) =>
                  setBookingData({ ...bookingData, room_price: e.target.value })
                }
              />
              <span className="required-marker">
                <sup>*</sup>
              </span>
            </div>
          </div>
          <div className="booking-flex-div">
            <div className="booking-single-inputs">
              <span className="heading-span">Advance Amount: </span>
              <input
                className="booking-form-input"
                type="text"
                name="advance_amount"
                value={bookingData.advance_amount}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    advance_amount: e.target.value,
                  })
                }
              />
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Food Amount: </span>
              <input
                className="booking-form-input"
                type="text"
                name="food_amount"
                value={bookingData.food_amount}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    food_amount: e.target.value,
                  })
                }
              />
            </div>
            <div className="booking-single-inputs">
              <span className="heading-span">Other Expenses: </span>
              <input
                className="booking-form-input"
                type="text"
                name="other_expenses"
                value={bookingData.other_expenses}
                onChange={(e) =>
                  setBookingData({
                    ...bookingData,
                    other_expenses: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </form>
        {(bookingData.booking_status == "Checked In" ||
          bookingData.booking_status == "Checked Out") && (
          <div className="booking-flex-div">
            <h2 className="cust-details-heading">Edit customer details</h2>
            <div className="booking-single-inputs">
              <button
                className="customer-manage-button"
                type="button"
                onClick={() => {
                  if (numberOfCustomers > 1) {
                    setNumberOfCustomers(numberOfCustomers - 1);
                  } else {
                    setNumberOfCustomers(1);
                  }
                }}
              >
                -
              </button>
            </div>
            <div className="booking-single-inputs">
              <button
                className="customer-manage-button"
                type="button"
                onClick={() => {
                  if (numberOfCustomers < 5) {
                    setNumberOfCustomers(numberOfCustomers + 1);
                  } else {
                    setNumberOfCustomers(numberOfCustomers);
                  }
                }}
              >
                +
              </button>
            </div>
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
                      <input
                        className="booking-form-input"
                        type="text"
                        name="first_name"
                        value={customer.first_name}
                        onChange={(e) => {
                          handleCustomerChange(
                            index,
                            "first_name",
                            e.target.value
                          );
                          if (index == 0) {
                            setBookingData({
                              ...bookingData,
                              customer_firstname: e.target.value,
                            });
                          }
                        }}
                      />
                      <span className="required-marker">
                        <sup>*</sup>
                      </span>
                    </div>
                    <div className="booking-single-inputs">
                      <span className="heading-span">Middle Name: </span>
                      <input
                        className="booking-form-input"
                        type="text"
                        name="middle_name"
                        value={customer.middle_name}
                        onChange={(e) => {
                          handleCustomerChange(
                            index,
                            "middle_name",
                            e.target.value
                          );
                          if (index == 0) {
                            setBookingData({
                              ...bookingData,
                              customer_middlename: e.target.value,
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="booking-single-inputs">
                      <span className="heading-span">Last Name: </span>
                      <input
                        className="booking-form-input"
                        type="text"
                        name="last_name"
                        value={customer.last_name}
                        onChange={(e) => {
                          handleCustomerChange(
                            index,
                            "last_name",
                            e.target.value
                          );
                          if (index == 0) {
                            setBookingData({
                              ...bookingData,
                              customer_lastname: e.target.value,
                            });
                          }
                        }}
                      />
                      <span className="required-marker">
                        <sup>*</sup>
                      </span>
                    </div>
                  </div>
                  <div className="booking-flex-div">
                    <div className="booking-single-inputs">
                      <span className="heading-span">Email: </span>
                      <input
                        className="booking-form-input"
                        type="text"
                        name="customer_email"
                        value={customer.customer_email}
                        onChange={(e) =>
                          handleCustomerChange(
                            index,
                            "customer_email",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="booking-single-inputs">
                      <span className="heading-span">Phone No: </span>
                      <input
                        className="booking-form-input"
                        type="text"
                        name="phone_no"
                        value={customer.phone_no}
                        onChange={(e) =>
                          handleCustomerChange(
                            index,
                            "phone_no",
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="booking-single-inputs">
                      <span className="heading-span">Date of Birth: </span>
                      <input
                        className="booking-form-input"
                        type="date"
                        name="dob"
                        value={customer.dob}
                        onChange={(e) =>
                          handleCustomerChange(index, "dob", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
              </form>
            ))}
          </div>
        )}
        <div className="booking-flex-div">
          <button
            className="create-booking-button"
            type="button"
            onClick={() => {
              handleBookingSubmit();
            }}
          >
            Edit Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBooking;
