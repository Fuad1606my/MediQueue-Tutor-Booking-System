import React, { useEffect, useState } from 'react';
import { Calendar, User, Globe, Tag, Clock, BookOpen, Loader2, Trash2, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDetails, setViewDetails] = useState(null);

  const fetchBookings = () => {
    axios.get(`http://localhost:5000/bookings?email=${user.email}`)
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (user?.email) {
      fetchBookings();
    }
  }, [user]);

  const handleCancelBooking = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this booking slot!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/bookings/${id}`)
          .then(res => {
            if (res.data.deletedCount > 0) {
              Swal.fire('Cancelled!', 'Booking entry has been removed.', 'success');
              fetchBookings();
            }
          });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            My Booked <span className="text-teal-600">Tutors</span>
          </h1>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
          </div>
        ) : (
          <>
            {bookings.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md mx-auto">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-slate-700">No Bookings Found</h3>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white text-xs font-black uppercase tracking-wider">
                        <th className="px-6 py-4">Tutor Details</th>
                        <th className="px-6 py-4">Language</th>
                        <th className="px-6 py-4">Scheduled Date</th>
                        <th className="px-6 py-4">Costing</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-base font-bold text-slate-800">
                      {bookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 cursor-pointer" onClick={() => setViewDetails(booking)}>
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-black text-sm border border-teal-300">
                                {booking.tutorName ? booking.tutorName.charAt(0) : 'T'}
                              </div>
                              <div>
                                <span className="font-black text-slate-900 block hover:text-teal-600 transition-colors">{booking.tutorName}</span>
                                <span className="text-xs text-slate-500 block flex items-center gap-1 mt-0.5"><User className="w-3 h-3" /> {booking.studentName}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-black bg-slate-100 text-slate-900 border border-slate-300">
                              <Globe className="w-3.5 h-3.5 text-slate-600" /> {booking.language}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-700 font-bold">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-slate-500" /> {booking.bookingDate}</span>
                          </td>
                          <td className="px-6 py-4 font-black text-slate-900">
                            <span className="inline-flex items-center gap-1"><Tag className="w-3.5 h-3.5 text-teal-600" /> {booking.currency === 'BDT' ? '৳' : '$'}{booking.price}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black uppercase bg-amber-100 text-amber-900 border border-amber-300"><Clock className="w-3 h-3" /> {booking.status}</span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <button onClick={() => handleCancelBooking(booking._id)} className="px-3 py-2 rounded-xl text-xs font-black text-white bg-red-500 hover:bg-red-600 cursor-pointer shadow-sm"><Trash2 className="w-3.5 h-3.5 inline mr-1" /> Cancel</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* --- বুকিং ডিটেইলস পপ-আপ মডাল --- */}
        {viewDetails && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative border border-slate-300 p-8 space-y-4">
              <button onClick={() => setViewDetails(null)} className="absolute top-5 right-5 text-slate-800 hover:text-black bg-slate-100 p-2 rounded-full border border-slate-300 cursor-pointer">
                <X className="w-6 h-6 stroke-[3]" />
              </button>
              <div>
                <h3 className="text-2xl font-black text-slate-900">{viewDetails.tutorName}</h3>
                <p className="text-sm font-bold text-teal-600 mt-1">Language Medium Focus: {viewDetails.language}</p>
              </div>
              <div className="border-t border-b border-slate-200 py-4">
                <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-2 text-teal-700">Tutor Description Details</h4>
                <p className="text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-line">{viewDetails.tutorDescription || 'Premium educational expert focusing on comprehensive curriculum design.'}</p>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-slate-700 bg-slate-50 p-3 rounded-xl border">
                <span>Booked User: {viewDetails.studentName}</span>
                <span>Scheduled: {viewDetails.bookingDate}</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MyBookings;