import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyBookings = ({ user: userProp }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Get active user from prop or localStorage
  const user = userProp || JSON.parse(localStorage.getItem('mediqueue_session')) || JSON.parse(localStorage.getItem('user')) || {};

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const activeEmail = user.email || '';
      // Fetch bookings matching user's account email or all bookings if fallback required
      const res = await axios.get(`${API_URL}/bookings?email=${encodeURIComponent(activeEmail)}`);
      setBookings(res.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [user.email]);

  const handleCancel = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Do you really want to cancel this booking?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, cancel it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await axios.patch(`${API_URL}/bookings/${id}`);
          if (res.data.success || res.status === 200) {
            Swal.fire('Cancelled!', 'Booking has been cancelled and tutor slot freed up.', 'success');
            fetchBookings();
          }
        } catch (error) {
          Swal.fire('Error', error.response?.data?.message || 'Failed to cancel booking', 'error');
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-6 font-sans">
      <h1 className="text-3xl font-black text-center text-slate-900">My Booked Sessions</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[13px] font-black text-slate-800">
                <th className="py-4 px-4">Booking ID / Token</th>
                <th className="py-4 px-4">Student Name</th>
                <th className="py-4 px-4">Phone</th>
                <th className="py-4 px-4">Tutor Name</th>
                <th className="py-4 px-4">Email Used</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 text-center">Cancel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="inline-flex items-center gap-3 text-blue-600 font-bold">
                      <div className="w-6 h-6 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      Loading your booked sessions...
                    </div>
                  </td>
                </tr>
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-slate-400 font-medium">
                    No booked sessions found.
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => {
                  const isCancelled = booking.status === 'cancelled';
                  return (
                    <tr key={booking._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">{booking._id}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{booking.name}</td>
                      <td className="py-3.5 px-4">{booking.phone}</td>
                      <td className="py-3.5 px-4">{booking.tutorName}</td>
                      <td className="py-3.5 px-4 text-blue-600 font-bold">{booking.email || booking.studentEmail}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          isCancelled ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {booking.status || 'Confirmed'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={isCancelled}
                          className="w-7 h-7 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition cursor-pointer"
                          title={isCancelled ? "Booking Cancelled" : "Cancel Session"}
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;