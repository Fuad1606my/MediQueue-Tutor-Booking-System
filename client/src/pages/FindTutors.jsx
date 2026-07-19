import React, { useEffect, useState } from 'react';
import { Search, Globe, Star, ArrowUpRight, BookOpen, Loader2, X, Clock as ClockIcon } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const FindTutors = ({ user, setActiveTab, redirectTarget, setRedirectTarget }) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [viewDetailsTutor, setViewDetailsTutor] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/tutors').then(res => {
      setTutors(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (user && redirectTarget && redirectTarget.type === 'book') {
      const saved = tutors.find(t => t._id === redirectTarget.tutorId);
      if (saved) setSelectedTutor(saved);
      setRedirectTarget(null);
    }
  }, [user, tutors, redirectTarget]);

  const filtered = tutors.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.language.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleBookingClick = (tutor) => {
    if (!user) {
      setRedirectTarget({ type: 'book', tutorId: tutor._id });
      setActiveTab('auth');
    } else {
      setSelectedTutor(tutor);
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const now = new Date();
    
    const bookingInfo = {
      tutorId: selectedTutor._id,
      tutorName: selectedTutor.name,
      tutorEmail: selectedTutor.email,
      tutorDescription: selectedTutor.description,
      language: selectedTutor.language,
      price: selectedTutor.price,
      currency: selectedTutor.currency,
      feeType: selectedTutor.feeType,
      studentName: form.studentName.value,
      studentEmail: form.studentEmail.value,
      bookingDate: form.bookingDate.value,
      timeSlot: selectedTutor.timeSlot,
      createdAt: now.toLocaleDateString() + ' ' + now.toLocaleTimeString(),
      status: "pending"
    };

    try {
      await axios.post('http://localhost:5000/bookings', bookingInfo);
      Swal.fire('🎉 Slot Requested Successfully!', 'Awaiting verification response.', 'success');
      setSelectedTutor(null);
    } catch (error) {
      Swal.fire('Oops', 'Booking submission failed.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-xl mx-auto mb-12 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400"><Search className="w-5 h-5" /></div>
          <input type="text" placeholder="Search parameters..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-300 shadow-md rounded-2xl text-slate-800 font-bold" />
        </div>

        {loading ? <div className="text-center py-20"><Loader2 className="w-10 h-10 animate-spin text-teal-600 mx-auto" /></div> : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map(t => (
              <div key={t._id} className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col justify-between group">
                <div className="p-6 cursor-pointer" onClick={() => setViewDetailsTutor(t)}>
                  <div className="flex items-center gap-4">
                    <img src={t.image} alt="" className="w-20 h-20 object-cover rounded-2xl border-2 border-teal-500 shadow-sm" onError={(e) => e.target.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} />
                    <div>
                      <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">{t.name}</h3>
                      <p className="text-sm font-bold text-slate-500 mb-1">{t.email}</p>
                      <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-lg text-xs font-black"><Star className="w-3.5 h-3.5 fill-current" /> 5.0</div>
                    </div>
                  </div>
                  <p className="mt-4 text-base font-bold text-slate-800 line-clamp-2">{t.description}</p>
                  <p className="text-sm font-black text-slate-600 mt-2 flex items-center gap-1"><ClockIcon className="w-4 h-4 text-teal-600" /> Slot: {t.timeSlot || 'Not Specified'}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-3 py-1 bg-slate-100 border text-xs font-black text-slate-800 rounded-xl">{t.language}</span>
                    <span className="px-3 py-1 bg-teal-50 border border-teal-200 text-xs font-black text-teal-900 rounded-xl">{t.currency === 'BDT' ? '৳' : '$'}{t.price} / {t.feeType}</span>
                  </div>
                </div>
                <div className="p-6 pt-0"><button onClick={() => handleBookingClick(t)} className="w-full py-3 bg-slate-900 text-white font-black rounded-xl text-center cursor-pointer">Book Appointment</button></div>
              </div>
            ))}
          </div>
        )}

        {/* --- বড় হাই-কন্ট্রাস্ট টিউটর ডিটেইলস মডাল --- */}
        {viewDetailsTutor && (
          <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 relative max-h-[92vh] overflow-y-auto border-4 border-slate-800">
              <button onClick={() => setViewDetailsTutor(null)} className="absolute top-5 right-5 text-red-600 hover:text-red-800 bg-red-50 p-3 rounded-full border-2 border-red-500 transition-all cursor-pointer shadow-md">
                <X className="w-7 h-7 stroke-[4]" />
              </button>
              <img src={viewDetailsTutor.image} alt="" className="w-full h-80 object-contain rounded-2xl bg-slate-100 border shadow-inner" onError={(e) => e.target.src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600'} />
              <h3 className="text-3xl font-black text-slate-900 mt-4">{viewDetailsTutor.name}</h3>
              <p className="text-base font-black text-teal-600 mb-2">{viewDetailsTutor.email}</p>
              <div className="bg-slate-50 border p-4 rounded-xl font-bold text-slate-800 space-y-2">
                <p><span className="text-teal-700 font-black">Subject Medium:</span> {viewDetailsTutor.language}</p>
                <p><span className="text-teal-700 font-black">Time Slot Option:</span> {viewDetailsTutor.timeSlot || 'Flexible schedules'}</p>
                <p><span className="text-teal-700 font-black">Cost Strategy:</span> {viewDetailsTutor.currency === 'BDT' ? '৳' : '$'}{viewDetailsTutor.price} per {viewDetailsTutor.feeType}</p>
              </div>
              <div className="pt-2"><h4 className="text-sm font-black text-slate-900 uppercase tracking-widest text-teal-700 mb-1">Full Biography</h4><p className="text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-line border-l-4 border-teal-500 pl-4">{viewDetailsTutor.description}</p></div>
            </div>
          </div>
        )}

        {/* --- বুকিং ফর্ম মডাল --- */}
        {selectedTutor && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative border border-slate-300">
              <button onClick={() => setSelectedTutor(null)} className="absolute top-4 right-4 text-slate-800 hover:text-black bg-slate-100 p-2 rounded-full cursor-pointer"><X className="w-5 h-5 stroke-[3]" /></button>
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white"><h3 className="text-xl font-black">Confirm Appointment Slot</h3></div>
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                <div><label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label><input type="text" name="studentName" defaultValue={user?.name || ''} required className="w-full px-4 py-2 border rounded-xl font-bold" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1">Your Email</label><input type="email" name="studentEmail" defaultValue={user?.email || ''} required className="w-full px-4 py-2 border rounded-xl font-bold" /></div>
                <div><label className="block text-sm font-bold text-slate-700 mb-1">Select Schedule Date</label><input type="date" name="bookingDate" required className="w-full px-4 py-2 border rounded-xl font-bold" /></div>
                <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center text-sm font-black border"><span>Assigned Slot:</span><span className="text-teal-600">{selectedTutor.timeSlot}</span></div>
                <button type="submit" className="w-full py-3 bg-teal-600 text-white font-black rounded-xl text-center cursor-pointer">Finalize Schedule</button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindTutors;