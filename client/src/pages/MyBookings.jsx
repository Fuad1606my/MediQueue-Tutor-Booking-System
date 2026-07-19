import React, { useEffect, useState } from 'react';
import { Loader2, Trash2, CheckCircle, XCircle, X, Users } from 'lucide-react';
import axios from 'react-all';
import axiosInstance from 'axios';
import Swal from 'sweetalert2';

const MyBookings = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewDetails, setViewDetails] = useState(null);

  const fetchBookings = () => {
    const apiURL = user.role === 'tutor' 
      ? `http://localhost:5000/bookings?tutorEmail=${user.email}`
      : `http://localhost:5000/bookings?studentEmail=${user.email}`;
      
    axiosInstance.get(apiURL).then(res => {
      setBookings(res.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const handleStatusUpdate = (id, newStatus) => {
    if (newStatus === 'denied') {
      axiosInstance.delete(`http://localhost:5000/bookings/${id}`).then(() => {
        Swal.fire('Vanish', 'Appointment slot rejected and vanished successfully.', 'success');
        fetchBookings();
      });
    } else {
      axiosInstance.patch(`http://localhost:5000/bookings/${id}`, { status: newStatus }).then(() => {
        Swal.fire('Accepted', 'Student enrolled successfully inside active roster.', 'success');
        fetchBookings();
      });
    }
  };

  const pendingRequests = bookings.filter(b => b.status === 'pending');
  const enrolledStudents = bookings.filter(b => b.status === 'accepted');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans space-y-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-black text-slate-900">
            {user.role === 'tutor' ? 'Received Student Applications' : 'My Requested Bookings'}
          </h1>
          {user.role === 'tutor' && pendingRequests.length > 0 && (
            <span className="bg-red-500 text-white text-sm font-black px-4 py-1.5 rounded-full shadow-md">
              Pending Slots Remaining: {pendingRequests.length}
            </span>
          )}
        </div>
        
        {loading ? <div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin text-teal-600 mx-auto" /></div> : (
          pendingRequests.length === 0 ? <p className="text-slate-500 font-bold text-center py-6 border rounded-2xl bg-white shadow-inner">No pending applications left.</p> : (
            <div className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900 text-white text-xs font-black uppercase">
                    <th className="px-6 py-4">{user.role === 'tutor' ? 'Student Details' : 'Tutor Details'}</th>
                    <th className="px-6 py-4">Language Track</th>
                    <th className="px-6 py-4">Schedule Frame</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-base font-bold text-slate-800">
                  {pendingRequests.map(b => (
                    <tr key={b._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-black" onClick={() => setViewDetails(b)}>{user.role === 'tutor' ? b.studentName : b.tutorName}</td>
                      <td className="px-6 py-4">{b.language}</td>
                      <td className="px-6 py-4 text-sm text-teal-600">{b.bookingDate} ({b.timeSlot})</td>
                      <td className="px-6 py-4 text-center">
                        {user.role === 'tutor' ? (
                          <div className="flex gap-2 justify-center">
                            <button onClick={() => handleStatusUpdate(b._id, 'accepted')} className="p-2 bg-green-500 text-white rounded-xl"><CheckCircle className="w-4 h-4" /></button>
                            <button onClick={() => handleStatusUpdate(b._id, 'denied')} className="p-2 bg-red-500 text-white rounded-xl"><XCircle className="w-4 h-4" /></button>
                          </div>
                        ) : (
                          <button onClick={() => handleStatusUpdate(b._id, 'denied')} className="px-3 py-1.5 bg-red-500 text-white rounded-xl text-xs">Cancel</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>

      {/* --- ALL ENROLLED STUDENTS SUB-DASHBOARD --- */}
      {user.role === 'tutor' && (
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 p-8">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2"><Users className="w-6 h-6 text-teal-600" /> Active Roster: All Enrolled Students</h2>
            <span className="bg-teal-600 text-white font-black text-sm px-4 py-1.5 rounded-full shadow">Total: {enrolledStudents.length} Students</span>
          </div>
          {enrolledStudents.length === 0 ? <p className="text-slate-500 font-bold text-center py-6">No verified enrolled members found inside your tracks.</p> : (
            <div className="divide-y divide-slate-100">
              {enrolledStudents.map(student => (
                <div key={student._id} className="flex items-center justify-between py-4 font-bold">
                  <div className="cursor-pointer" onClick={() => setViewDetails(student)}>
                    <h4 className="text-lg font-black text-slate-900 hover:text-teal-600 transition-all">{student.studentName}</h4>
                    <p className="text-sm text-slate-500">{student.studentEmail} • Curriculum Target: <span className="text-teal-600 font-black">{student.language}</span></p>
                  </div>
                  <button onClick={() => handleStatusUpdate(student._id, 'denied')} className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-500 hover:text-white rounded-xl text-xs shadow-sm transition-all cursor-pointer">Remove Student</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* --- ডিটেইলস মডাল --- */}
      {viewDetails && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative border-4 border-slate-800">
            <button onClick={() => setViewDetails(null)} className="absolute top-4 right-4 text-red-600 bg-red-50 p-2 rounded-full border-2 border-red-500 cursor-pointer shadow-md"><X className="w-6 h-6 stroke-[4]" /></button>
            <h3 className="text-2xl font-black text-slate-900 mb-4">Itinerary Curricular dossier</h3>
            <p className="text-base font-bold text-slate-700 leading-relaxed border-l-4 border-teal-500 pl-4">{viewDetails.tutorDescription || 'Course schedule syllabus notes configured successfully.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;