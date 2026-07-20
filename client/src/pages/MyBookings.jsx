import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Copy, Trash2, Calendar, Clock, CheckCircle } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    if (!user?.email) return;
    setLoading(true);
    axios.get(`${API_URL}/bookings?studentEmail=${user.email}`)
      .then(res => {
        setBookings(res.data || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleCopyToken = (token) => {
    navigator.clipboard.writeText(token);
    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Session Token Copied!',
      showConfirmButton: false,
      timer: 2000
    });
  };

  const handleCancelBooking = (id) => {
    Swal.fire({
      title: 'Cancel Booking?',
      text: "Are you sure you want to cancel this tutoring session?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, Cancel it'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`${API_URL}/bookings/${id}`)
          .then(() => {
            Swal.fire('Cancelled!', 'Your session has been cancelled.', 'success');
            fetchBookings();
          })
          .catch(() => {
            Swal.fire('Error', 'Failed to cancel session.', 'error');
          });
      }
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center font-sans">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-black text-slate-900">My Booked Sessions</h1>
        <p className="text-xs text-slate-500 font-bold mt-1">Manage and track your upcoming tutoring appointments.</p>
      </div>

      {bookings.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
            📅
          </div>
          <h3 className="text-xl font-black text-slate-800">No Sessions Booked Yet</h3>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">Explore our verified expert tutors and book your first learning session today.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/70 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                  <th className="py-4 px-6">Tutor Info</th>
                  <th className="py-4 px-6">Schedule</th>
                  <th className="py-4 px-6">Session Token</th>
                  <th className="py-4 px-6">Price</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-800">
                {bookings.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/80 transition-all">
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-black text-slate-900">{item.tutorName}</p>
                        <p className="text-[11px] font-black text-blue-600">{item.language || item.subject}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-0.5 text-slate-600 text-[11px]">
                        <p className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.bookingDate || 'Upcoming'}</p>
                        <p className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-400" /> {item.timeSlot || '4:00 PM – 8:00 PM'}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80 text-blue-600 font-mono text-xs">
                        <span>{item.sessionToken || 'MQ-SESSION'}</span>
                        <button onClick={() => handleCopyToken(item.sessionToken)} className="hover:text-blue-800 cursor-pointer">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-black text-slate-900">
                      ${item.price || 45}/hr
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-[10px] font-black border border-green-200">
                        <CheckCircle className="w-3 h-3" /> Confirmed
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button onClick={() => handleCancelBooking(item._id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;