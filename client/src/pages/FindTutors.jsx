import React, { useEffect, useState } from 'react';
import { Search, Globe, Star, ArrowUpRight, BookOpen, Loader2, X } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const FindTutors = ({ user, setUser, setActiveTab, redirectTarget, setRedirectTarget }) => {
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [viewDetailsTutor, setViewDetailsTutor] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/tutors')
      .then(res => {
        setTutors(res.data);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (user && redirectTarget && redirectTarget.type === 'book') {
      const savedTutor = tutors.find(t => t._id === redirectTarget.tutorId);
      if (savedTutor) {
        setSelectedTutor(savedTutor);
      }
      setRedirectTarget(null);
    }
  }, [user, tutors, redirectTarget]);

  const filteredTutors = tutors.filter(tutor => 
    tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tutor.language.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    
    const bookingInfo = {
      tutorId: selectedTutor._id,
      tutorName: selectedTutor.name,
      tutorDescription: selectedTutor.description,
      language: selectedTutor.language,
      price: selectedTutor.price,
      currency: selectedTutor.currency,
      feeType: selectedTutor.feeType,
      studentName: form.studentName.value,
      studentEmail: form.studentEmail.value,
      bookingDate: form.bookingDate.value,
      status: "pending"
    };

    try {
      const response = await fetch('http://localhost:5000/bookings', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(bookingInfo)
      });
      const data = await response.json();

      if (data.insertedId) {
        Swal.fire({
          title: '🎉 Slot Booked Successfully!',
          text: `Your session with ${selectedTutor.name} has been scheduled.`,
          icon: 'success',
          confirmButtonColor: '#0D9488'
        });
        setSelectedTutor(null);
      }
    } catch (error) {
      Swal.fire({ title: 'Oops!', text: 'Booking failed.', icon: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">
            Find Your Perfect <span className="text-teal-600 bg-teal-50 px-3 py-1 rounded-xl">Language Tutor</span>
          </h1>
        </div>

        <div className="max-w-xl mx-auto mb-12 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input 
            type="text" 
            placeholder="Search by tutor name or language medium..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 shadow-md rounded-2xl text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTutors.map((tutor) => (
              <div key={tutor._id} className="bg-white rounded-2xl shadow-lg border border-slate-200 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group">
                <div className="p-6 cursor-pointer" onClick={() => setViewDetailsTutor(tutor)}>
                  <div className="flex items-start gap-4">
                    <img src={tutor.image} alt="" className="w-20 h-20 object-cover rounded-2xl border-2 border-teal-500 bg-slate-100 shadow-sm" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'; }} />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-black text-slate-900 truncate group-hover:text-teal-600 transition-colors">{tutor.name}</h3>
                      <p className="text-sm font-bold text-slate-600 truncate mb-1">{tutor.email}</p>
                      <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-xl w-fit text-xs font-black"><Star className="w-3.5 h-3.5 fill-current" /><span>5.0</span></div>
                    </div>
                  </div>
                  <p className="mt-4 text-base font-bold text-slate-800 line-clamp-3 leading-relaxed">{tutor.description}</p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-slate-100 text-slate-800 border border-slate-300"><Globe className="w-3.5 h-3.5 inline mr-1" /> {tutor.language}</span>
                    <span className="px-3 py-1.5 rounded-xl text-xs font-black bg-teal-50 text-teal-900 border border-teal-200">{tutor.currency === 'BDT' ? '৳' : '$'}{tutor.price} / {tutor.feeType || 'hr'}</span>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-2">
                  <button onClick={() => handleBookingClick(tutor)} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-teal-600 text-white font-black text-sm rounded-xl transition-all shadow-md cursor-pointer">
                    Book Appointment <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- লাক্সারি হাই-ভিজিবিলিটি টিউটর ডিটেইলস মডাল --- */}
        {viewDetailsTutor && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden relative border border-slate-300 p-8 space-y-6 max-h-[92vh] overflow-y-auto">
              <button onClick={() => setViewDetailsTutor(null)} className="absolute top-5 right-5 text-slate-800 hover:text-black bg-slate-100 p-2 rounded-full hover:bg-slate-200 border border-slate-300 transition-all cursor-pointer">
                <X className="w-6 h-6 stroke-[3]" />
              </button>
              <img src={viewDetailsTutor.image} alt="" className="w-full h-80 object-contain rounded-2xl bg-slate-50 border border-slate-200 shadow-sm" onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600'; }} />
              <div>
                <h3 className="text-3xl font-black text-slate-900">{viewDetailsTutor.name}</h3>
                <p className="text-base font-black text-teal-600 mt-0.5">{viewDetailsTutor.email}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <span className="px-4 py-2 rounded-xl text-sm font-black bg-slate-100 text-slate-800 border border-slate-300">{viewDetailsTutor.language}</span>
                <span className="px-4 py-2 rounded-xl text-sm font-black bg-teal-50 text-teal-900 border border-teal-300">{viewDetailsTutor.currency === 'BDT' ? '৳' : '$'}{viewDetailsTutor.price} / {viewDetailsTutor.feeType || 'hr'}</span>
              </div>
              <div className="border-t border-slate-200 pt-4">
                <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-2 text-teal-700">Full Biography Details</h4>
                <p className="text-lg font-bold text-slate-800 leading-relaxed whitespace-pre-line">{viewDetailsTutor.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* --- বুকিং মডাল --- */}
        {selectedTutor && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden relative border border-slate-300">
              <button onClick={() => setSelectedTutor(null)} className="absolute top-4 right-4 text-slate-800 hover:text-black bg-slate-100 p-1.5 rounded-full border border-slate-300 cursor-pointer">
                <X className="w-5 h-5 stroke-[3]" />
              </button>
              <div className="bg-gradient-to-r from-teal-600 to-cyan-600 p-6 text-white">
                <h3 className="text-xl font-black">Confirm Your Booking Slot</h3>
                <p className="text-sm font-bold text-teal-100 mt-1">Booking session with {selectedTutor.name}</p>
              </div>
              <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Your Name</label>
                  <input type="text" name="studentName" defaultValue={user?.name || ''} required className="w-full px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Your Email</label>
                  <input type="email" name="studentEmail" defaultValue={user?.email || ''} required className="w-full px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-800" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Select Schedule Date</label>
                  <input type="date" name="bookingDate" required className="w-full px-4 py-2 border border-slate-300 rounded-xl font-bold text-slate-800" />
                </div>
                <div className="bg-slate-50 p-3 rounded-xl flex justify-between items-center text-sm font-black text-slate-800 border">
                  <span>Total Costing:</span>
                  <span className="text-teal-600 text-lg font-black">{selectedTutor.currency === 'BDT' ? '৳' : '$'}{selectedTutor.price}</span>
                </div>
                <button type="submit" className="w-full py-3 bg-teal-600 text-white font-black text-sm rounded-xl text-center cursor-pointer">Finalize Booking</button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default FindTutors;