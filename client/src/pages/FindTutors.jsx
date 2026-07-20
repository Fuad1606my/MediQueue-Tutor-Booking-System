import React, { useEffect, useState } from 'react';
import { Search, Star, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import TutorDetails from './TutorDetails';

const FindTutors = ({ user, setActiveTab, setRedirectTarget }) => {
  const [tutors, setTutors] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTutorDetails, setActiveTutorDetails] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/tutors')
      .then(res => setTutors(res.data))
      .catch(err => console.error("Error fetching tutors:", err));
  }, []);

  const filtered = tutors.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.language?.toLowerCase().includes(search.toLowerCase()) ||
    t.subject?.toLowerCase().includes(search.toLowerCase())
  );

  // যদি কোনো টিউটর সিলেক্ট করা হয়, তবে ডিটেইলস ভিউ রেন্ডার হবে
  if (activeTutorDetails) {
    return (
      <TutorDetails 
        tutor={activeTutorDetails} 
        user={user} 
        onBack={() => setActiveTutorDetails(null)} 
        setActiveTab={setActiveTab} 
        setRedirectTarget={setRedirectTarget} 
      />
    );
  }

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
          className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 shadow-sm focus:outline-none focus:border-blue-500" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(t => (
          <div 
            key={t._id} 
            onClick={() => setActiveTutorDetails(t)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 p-5 flex flex-col justify-between h-full relative overflow-hidden transition-all cursor-pointer group"
          >
            <div>
              <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black rounded-lg text-white z-10 ${t.teachingMode === 'Online' ? 'bg-cyan-600' : 'bg-blue-600'}`}>
                {t.teachingMode || 'Online'}
              </span>

              <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border mb-4">
                <img src={t.image || '/male-avatar.jpg'} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" onError={(e)=>{e.target.src='/male-avatar.jpg'}} />
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-all">{t.name}</h3>
                  <p className="text-xs font-black text-blue-600">{t.language || t.subject}</p>
                </div>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.9 <span className="text-slate-400 font-bold">(112 reviews)</span>
                </div>
                <div className="space-y-1 text-xs font-bold text-slate-500 pt-1">
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {t.location || 'Dhaka, BD'}</p>
                  <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {t.timeSlot || 'Mon - Fri, 5:00 PM'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
              <span className="text-xl font-black text-slate-900">${t.price || 45}<span className="text-xs text-slate-500 font-bold">/hr</span></span>
              <button className="px-4 py-2 bg-blue-600 text-white font-black text-xs rounded-xl shadow group-hover:bg-blue-700 transition-all">
                Book Session
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FindTutors;