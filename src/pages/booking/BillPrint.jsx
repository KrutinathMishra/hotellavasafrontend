import React, { useState, useEffect, useContext } from "react";
import ReactToPrint from "react-to-print";
import "./BillPrint.css";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Switch from "react-switch";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import signature from "../../assets/signature.jpg";
import { GlobalState } from "../../GlobalState";

class ComponentToPrint extends React.Component {
  render() {
    const { billData } = this.props;
    const { bookingData } = this.props;
    const { rooms } = this.props;

    const checkinDate = new Date(bookingData.checkin_date);
    const checkoutDate = new Date(bookingData.checkout_date);
    const timeDiff = Math.abs(checkoutDate - checkinDate);
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    const room = rooms.find(
      (room) => room.room_number === bookingData.room_number
    );
    const roomType = room ? room.type : "Room not found";

    function formatDatePrint(dateString) {
      const [day, month, year] = dateString.split("/").map(Number);
      const date = new Date(year, month - 1, day);

      const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];

      const getOrdinalSuffix = (day) => {
        if (day > 3 && day < 21) return "th";
        switch (day % 10) {
          case 1:
            return "st";
          case 2:
            return "nd";
          case 3:
            return "rd";
          default:
            return "th";
        }
      };

      const formattedDay = day + getOrdinalSuffix(day);
      const formattedMonth = monthNames[month - 1];
      const formattedDate = `${formattedDay} ${formattedMonth}, ${year}`;

      return formattedDate;
    }
    const formatDate = (datee) => {
      const date = new Date(datee);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    };

    function convertToISO(dateString) {
      const date = new Date(dateString);

      const isoString = `${date.getFullYear()}-${(
        "0" +
        (date.getMonth() + 1)
      ).slice(-2)}-${("0" + date.getDate()).slice(-2)}T${(
        "0" + date.getHours()
      ).slice(-2)}:${("0" + date.getMinutes()).slice(-2)}:${(
        "0" + date.getSeconds()
      ).slice(-2)}.${("00" + date.getMilliseconds()).slice(-3)}Z`;

      return isoString;
    }

    return (
      <div className="bill-container">
        <header className="bill-header">
          <h1>HOTEL LAVASA</h1>
          <p>
            <b>(A unit of Maa Durga Enterprises)</b>
          </p>
          <p>821/4534, 1/6911, Samaraipur, Gelpur, Bhadrak</p>
          {billData.isHotelGST && <p>GST: 21DHPPM2318G1ZI</p>}
          <p>Phone: +91-9692003007</p>
        </header>
        <section className="bill-info">
          <p>
            <strong>Bill Number:</strong>
            {bookingData.booking_id}
          </p>
          {billData.isCustomBillDate && (
            <p>
              <strong>Bill Date:</strong>
              {formatDatePrint(
                formatDate(convertToISO(billData.customBillDate))
              )}
            </p>
          )}
          {!billData.isCustomBillDate && (
            <p>
              <strong>Bill Date:</strong>
              {formatDatePrint(formatDate(convertToISO(billData.dateToday)))}
            </p>
          )}
        </section>
        <section className="guest-info">
          <h2>Guest Information</h2>
          {billData.isCustomerCompany && (
            <>
              <p>
                <strong>Name: </strong> {billData.companyName}
              </p>
              <p>
                <strong>Address:</strong> {billData.companyAddress}
              </p>
              <p>
                <strong>GST:</strong> {billData.companyGST.toUpperCase()}
              </p>
            </>
          )}
          {!billData.isCustomerCompany && (
            <>
              <p>
                <strong>Name:</strong>{" "}
                {`${bookingData.customer_firstname} ${bookingData.customer_lastname}`}
              </p>
              <p>
                <strong>Mobile:</strong>
                {bookingData.customer_contact}
              </p>
              {billData.isCustomerGST && (
                <p>
                  <strong>GST:</strong> {billData.customerGST.toUpperCase()}
                </p>
              )}
            </>
          )}
          <p>
            <strong>Check-in Date:</strong>{" "}
            {formatDatePrint(formatDate(bookingData.checkin_date))}
          </p>
          <p>
            <strong>Check-out Date:</strong>{" "}
            {formatDatePrint(formatDate(bookingData.checkout_date))}
          </p>
        </section>

        <section className="room-details">
          <h2>Room Details</h2>
          <table>
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Room Type</th>
                <th>Rate (per night)</th>
                <th>Total Members</th>
                <th>No. of night</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{bookingData.room_number}</td>
                <td>{roomType}</td>
                <td>{bookingData.room_price}</td>
                <td>{bookingData.customer_ids.length}</td>
                <td>{daysDiff}</td>
              </tr>
            </tbody>
          </table>
        </section>
        <section className="charges">
          <h2>Charges</h2>
          <table>
            <tbody>
              <tr>
                <td>Room Charges</td>
                <td>{bookingData.total_room_price}</td>
              </tr>
              <tr>
                <td>GST</td>
                <td>{bookingData.gst}</td>
              </tr>
              <tr>
                <td>Food</td>
                <td>{bookingData.food_amount}</td>
              </tr>
              <tr>
                <td>Other Expenses</td>
                <td>{bookingData.other_expenses}</td>
              </tr>
              <tr>
                <td>
                  <strong>Total Amount</strong>
                </td>
                <td>
                  <strong>{bookingData.total_bill_amount}</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
        <footer className="bill-footer">
          <p>Thank you for staying with us!</p>
          <div className="signature">
            <img className="sig-image" src={signature} alt="signature" />
          </div>
        </footer>
      </div>
    );
  }
}

const BillPrint = () => {
  const state = useContext(GlobalState);
  const [token, setToken] = state.token;

  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);

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
    remaining_amount: "",
    food_amount: "",
    other_expenses: "",
    gst: "",
    total_room_price: "",
    total_bill_amount: "",
  });

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
        ]);

        const sortedRooms = roomsRes.data.sort(
          (a, b) => parseInt(a.room_number) - parseInt(b.room_number)
        );
        const sortedBookings = bookingsRes.data.sort(
          (a, b) =>
            parseInt(a.booking_id.substring(2)) -
            parseInt(b.booking_id.substring(2))
        );

        setRooms(sortedRooms);
        setBookings(sortedBookings);

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
          booking_date: selectedBooking.booking_date,
          checkin_date: selectedBooking.checkin_date,
          checkout_date: selectedBooking.checkout_date,
          room_number: selectedBooking.room_number,
          room_price: selectedBooking.room_price,
          customer_ids: selectedBooking.customer_ids,
          advance_amount: selectedBooking.advance_amount,
          remaining_amount: selectedBooking.remaining_amount,
          food_amount: selectedBooking.food_amount,
          other_expenses: selectedBooking.other_expenses,
          gst: selectedBooking.gst,
          total_room_price: selectedBooking.total_room_price,
          total_bill_amount: selectedBooking.total_bill_amount,
        });
      }
      setLoading(false);
    }
  }, [bookings, id]);

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const [billData, setBillData] = useState({
    isHotelGST: true,
    isCustomBillDate: false,
    customBillDate: "",
    dateToday: new Date(),
    isCustomerCompany: false,
    companyName: "",
    companyAddress: "",
    companyGST: "",
    isCustomerGST: false,
    customerGST: "",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setBillData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSwitchChange = (checked, name) => {
    setBillData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleAmountClear = async () => {
    if (!token) {
      console.log("token not found");
      return;
    }
    try {
      const response = await axios.put(
        `/booking/clear-balance/${bookingData.booking_id}`,
        {
          advance_amount: bookingData.total_bill_amount,
        },
        {
          headers: { Authorization: token },
        }
      );

      if (response.data.error) {
        toast.error(response.data.error);
      } else {
        toast.success("Booking Update Successful.");
        window.location.replace(
          `/admin/booking/print/${bookingData.booking_id}`
        );
      }
    } catch (error) {
      toast.error("Failed to update booking. Please try again.");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(billData);
  };

  let componentRef = React.useRef();

  return (
    <div className="print-page-container">
      <div className="print-page-heading">
        <h2>Print Bill</h2>
        <button
          className="add-booking-button"
          onClick={() => navigate("/admin/booking")}
        >
          All Booking
        </button>
      </div>
      <div className="print-page-content">
        <div className="print-bill">
          <ComponentToPrint
            bookingData={bookingData}
            billData={billData}
            rooms={rooms}
            ref={(el) => (componentRef = el)}
          />
        </div>
        <div className="bill-data-inputs">
          <div className="remaining-amount">
            <label className="remaining-heading">
              Reamining Amount to collect:
            </label>
            <span id="remaining_amount" className="bill-readonly-spans">
              {bookingData.remaining_amount}
            </span>
            <button
              className="amount-clear-button"
              type="button"
              onClick={() => {
                handleAmountClear();
              }}
            >
              Paid
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="bill-single-input">
              <label>
                <Switch
                  onColor={getComputedStyle(document.documentElement)
                    .getPropertyValue("--color-secondary")
                    .trim()}
                  onChange={(checked) =>
                    handleSwitchChange(checked, "isHotelGST")
                  }
                  checked={billData.isHotelGST}
                />
              </label>
              <span>Hotel GST</span>
            </div>
            <div className="bill-single-input">
              <label>
                <Switch
                  onColor={getComputedStyle(document.documentElement)
                    .getPropertyValue("--color-secondary")
                    .trim()}
                  onChange={(checked) =>
                    handleSwitchChange(checked, "isCustomBillDate")
                  }
                  key={`switch-${billData.isCustomBillDate}`}
                  checked={billData.isCustomBillDate}
                />
              </label>
              <span>Custom Bill Date</span>
            </div>
            {billData.isCustomBillDate && (
              <div className="bill-single-input">
                <label>
                  Custom bill date:
                  <DatePicker
                    selected={billData.customBillDate}
                    onChange={(date) => {
                      setBillData({
                        ...billData,
                        customBillDate: date,
                      });
                    }}
                    key={`datepicker-${billData.customBillDate}`}
                    dateFormat="dd/MM/yyyy"
                    className="date-picker-class"
                  />
                </label>
              </div>
            )}
            <div className="bill-single-input">
              <label>
                <Switch
                  onColor={getComputedStyle(document.documentElement)
                    .getPropertyValue("--color-secondary")
                    .trim()}
                  onChange={(checked) =>
                    handleSwitchChange(checked, "isCustomerCompany")
                  }
                  checked={billData.isCustomerCompany}
                />
              </label>
              <span>Print bill on Company Name</span>
            </div>
            {billData.isCustomerCompany && (
              <>
                <div className="bill-single-input">
                  <label>
                    Company Name:
                    <input
                      type="text"
                      name="companyName"
                      value={billData.companyName}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="bill-single-input">
                  <label>
                    Company Address:
                    <input
                      type="text"
                      name="companyAddress"
                      value={billData.companyAddress}
                      onChange={handleChange}
                    />
                  </label>
                </div>
                <div className="bill-single-input">
                  <label>
                    Company GST:
                    <input
                      type="text"
                      name="companyGST"
                      value={billData.companyGST}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              </>
            )}
            <div className="bill-single-input">
              <label>
                <Switch
                  onColor={getComputedStyle(document.documentElement)
                    .getPropertyValue("--color-secondary")
                    .trim()}
                  onChange={(checked) =>
                    handleSwitchChange(checked, "isCustomerGST")
                  }
                  checked={billData.isCustomerGST}
                />
              </label>
              <span>Customer GST</span>
            </div>
            {billData.isCustomerGST && (
              <div className="bill-single-input">
                <label>
                  Customer GST:
                  <input
                    type="text"
                    name="customerGST"
                    value={billData.customerGST}
                    onChange={handleChange}
                  />
                </label>
              </div>
            )}
            <ReactToPrint
              trigger={() => (
                <button className="print-button">Print Bill</button>
              )}
              content={() => componentRef}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BillPrint;
