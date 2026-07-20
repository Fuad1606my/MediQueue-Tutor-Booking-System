import React, { useEffect, useState } from 'react';
import { Search, Star, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import Swal from 'sweetalert2';

const FindTutors = ({ user }) => {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedTutor, setSelectedTutor] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/tutors').then(res => setTutors(res.data));
  }, []);

  const filtered = tutors.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.language?.toLowerCase().includes(search.toLowerCase())
  );

  const handleBooking = async (e) => {
    e.preventDefault();
    const token = `MQ-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const bookingData = {
      tutorName: selectedTutor.name,
      tutorEmail: selectedTutor.email,
      studentName: user?.name || 'Student',
      studentEmail: user?.email,
      language: selectedTutor.language,
      price: selectedTutor.price,
      sessionToken: token,
      bookingDate: e.target.date.value,
      timeSlot: selectedTutor.timeSlot,
      status: 'accepted'
    };

    try {
      await axios.post('http://localhost:5000/bookings', bookingData);
      setSelectedTutor(null);
      Swal.fire({
        title: 'Session Booked!',
        html: `<p>Your Session Token:</p><b class="text-blue-600 font-mono text-lg">${token}</b>`,
        icon: 'success'
      });
    } catch (err) {
      Swal.fire('Error', 'Booking failed', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Browse Tutors</h1>
        <p className="text-xs text-slate-500 font-bold mt-1">Find your perfect tutor from our network of vetted experts.</p>
      </div>

      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by name or subject..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(t => (
          <div key={t._id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4 flex flex-col justify-between relative">
            <span className={`absolute top-3 right-3 px-2 py-0.5 text-[10px] font-black rounded text-white ${t.teachingMode === 'Online' ? 'bg-cyan-600' : 'bg-blue-600'}`}>
              {t.teachingMode || 'Online'}
            </span>
            <img src={t.image || '/male-avatar.jpg'} alt="" className="w-full h-44 object-cover rounded-xl bg-slate-100" onError={(e)=>e.target.src='/male-avatar.jpg'} />
            <div>
              <h3 className="text-lg font-black text-slate-900">{t.name}</h3>
              <p className="text-xs font-black text-blue-600">{t.language}</p>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-black mt-1"><Star className="w-3.5 h-3.5 fill-current" /> 4.9</div>
            </div>
            <div className="flex justify-between items-center border-t pt-3">
              <span className="text-xl font-black text-slate-900">${t.price}<span className="text-xs text-slate-500">/hr</span></span>
              <button onClick={() => setSelectedTutor(t)} className="px-4 py-2 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 cursor-pointer">
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedTutor && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 border">
            <h3 className="text-xl font-black text-slate-900">Book Session</h3>
            <p className="text-xs text-slate-500 font-bold">Tutor: <span className="text-blue-600">{selectedTutor.name}</span></p>
            <form onSubmit={handleBooking} className="space-y-3">
              <div><label className="text-xs font-black">Session Date</label><input type="date" name="date" required className="w-full p-2 border rounded-xl text-xs font-bold mt-1" /></div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setSelectedTutor(null)} className="w-1/2 py-2 bg-slate-100 rounded-xl text-xs font-black cursor-pointer">Cancel</button>
                <button type="submit" className="w-1/2 py-2 bg-blue-600 text-white rounded-xl text-xs font-black cursor-pointer">Confirm</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindTutors;