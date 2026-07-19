import React, { useEffect, useState } from 'react';
import { Calendar, User, Globe, Tag, Clock, BookOpen, Loader2, Trash2, CheckCircle, XCircle, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDetails, setViewDetails] = useState(null);

  const fetchBookings = () => {
    const apiURL = user.role === 'tutor' 
      ? `http://localhost:5000/bookings?tutorEmail=${user.email}`
      : `http://localhost:5000/bookings?studentEmail=${user.email}`;
      
    axios.get(apiURL).then(res => {
      setBookings(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleStatusUpdate = (id, newStatus) => {
    axios.patch(`http://localhost:5000/bookings/${id}`, { status: newStatus }).then(() => {
      Swal.fire('Updated', `Appointment slot marked as ${newStatus}.`, 'success');
      fetchBookings();
    });
  };

  const handleCancelBooking = (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Remove this appointment entry?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, cancel it!'
    }).then((result) => {
      if (result.isConfirmed) {
        axios.delete(`http://localhost:5000/bookings/${id}`).then(() => {
          Swal.fire('Deleted!', 'Appointment request cleared.', 'success');
          fetchBookings();
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8">{user.role === 'tutor' ? 'Received Student Applications' : 'My Requested Bookings'}</h1>
        
        {loading ? <div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin text-teal-600 mx-auto" /></div> : (
          bookings.length === 0 ? <p className="text-center py-16 text-slate-500 font-bold">No slots generated inside your itinerary hub.</p> : (
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs font-black uppercase">
                    <th className="px-6 py-4">{user.role === 'tutor' ? 'Student Details' : 'Tutor Details'}</th>
                    <th className="px-6 py-4">Language Track</th>
                    <th className="px-6 py-4">Schedule Frame</th>
                    <th className="px-6 py-4">Placed Stamp</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-base font-bold text-slate-800">
                  {bookings.map(b => (
                    <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 cursor-pointer text-slate-900 font-black" onClick={() => setViewDetails(b)}>
                        {user.role === 'tutor' ? b.studentName : b.tutorName}
                        <span className="block text-xs text-slate-400 font-bold">{user.role === 'tutor' ? b.studentEmail : b.tutorEmail}</span>
                      </td>
                      <td className="px-6 py-4"><span className="px-2 py-0.5 bg-slate-100 border text-xs rounded-lg">{b.language}</span></td>
                      <td className="px-6 py-4 text-sm text-slate-700">{b.bookingDate} <span className="block text-xs font-black text-teal-600">{b.timeSlot}</span></td>
                      <td className="px-6 py-4 text-xs text-slate-400">{b.createdAt || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${b.status === 'accepted' ? 'bg-green-100 text-green-800' : b.status === 'denied' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>{b.status}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {user.role === 'tutor' ? (
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleStatusUpdate(b._id, 'accepted')} className="p-2 bg-green-500 text-white rounded-xl text-xs"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => handleStatusUpdate(b._id, 'denied')} className="p-2 bg-red-500 text-white rounded-xl text-xs"><XCircle className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => handleCancelBooking(b._id)} className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs shadow-sm cursor-pointer"><Trash2 className="w-3.5 h-3.5 inline mr-1" /> Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}

        {/* --- বড় হাই-কন্ট্রাস্ট মডাল পপ-আপ --- */}
        {viewDetails && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border-4 border-slate-800">
              <button onClick={() => setViewDetails(null)} className="absolute top-4 right-4 text-red-600 hover:text-red-800 bg-red-50 p-2.5 rounded-full border-2 border-red-500 cursor-pointer shadow-md">
                <X className="w-6 h-6 stroke-[4]" />
              </button>
              <h3 className="text-2xl font-black text-slate-900 mb-2">{user.role === 'tutor' ? 'Student Registration Itinerary' : 'Tutor Curricular Dossier'}</h3>
              <div className="bg-slate-50 border p-4 rounded-xl font-bold text-slate-800 space-y-2 text-base">
                <p><span className="text-teal-700 font-black">Course Target:</span> {viewDetails.language}</p>
                <p><span className="text-teal-700 font-black">Allocated Frame:</span> {viewDetails.bookingDate} ({viewDetails.timeSlot})</p>
                <p><span className="text-teal-700 font-black">Booking Stamp:</span> {viewDetails.createdAt || 'N/A'}</p>
                <p><span className="text-teal-700 font-black">Tuition Valuation:</span> {viewDetails.currency === 'BDT' ? '৳' : '$'}{viewDetails.price} / {viewDetails.feeType}</p>
              </div>
              <div className="pt-2"><h4 className="text-sm font-black text-slate-900 uppercase tracking-widest text-teal-700 mb-1">Itinerary Syllabus Notes</h4><p className="text-lg font-bold text-slate-800 leading-relaxed border-l-4 border-teal-500 pl-4">{viewDetails.tutorDescription || 'Premium language curriculum strategy map initialized successfully.'}</p></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;