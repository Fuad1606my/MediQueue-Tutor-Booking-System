import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { Copy } from 'lucide-react';

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    if (user?.email) {
      axios.get(`http://localhost:5000/bookings?studentEmail=${user.email}`)
        .then(res => setBookings(res.data));
    }
  }, [user]);

  const handleCopy = (token) => {
    navigator.clipboard.writeText(token);
    Swal.fire({ title: 'Copied!', text: 'Session token copied to clipboard', icon: 'success', timer: 1500, showConfirmButton: false });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 max-w-4xl mx-auto space-y-6 font-sans">
      <h1 className="text-3xl font-black text-slate-900">My Booked Sessions</h1>
      <p className="text-xs text-slate-500 font-bold">{bookings.length} session scheduled</p>

      {bookings.map(b => (
        <div key={b._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-black text-slate-900">{b.tutorName}</h3>
              <p className="text-xs font-black text-blue-600">{b.language}</p>
              <p className="text-xs text-slate-500 mt-1">📅 {b.bookingDate} • 🕒 {b.timeSlot || '4:00 PM - 8:00 PM'}</p>
            </div>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 text-xs font-black rounded-full">Upcoming</span>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase">Session Token</p>
              <p className="text-sm font-black font-mono text-blue-600">{b.sessionToken || 'MQ-20260720-8Q8TD8'}</p>
            </div>
            <button onClick={() => handleCopy(b.sessionToken || 'MQ-20260720-8Q8TD8')} className="flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-xs font-black text-slate-700 cursor-pointer shadow-sm">
              <Copy className="w-3.5 h-3.5" /> Copy
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBookings;