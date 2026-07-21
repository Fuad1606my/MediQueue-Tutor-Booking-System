import React, { useEffect, useState } from 'react';
import { Search, Star, MapPin, Clock, X, ZoomIn } from 'lucide-react';
import axios from 'axios';
import TutorDetails from './TutorDetails';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Exporting masterTutorsList to prevent App.jsx / Home.jsx crashes
export const masterTutorsList = [
  {
    _id: "t1",
    name: "Dr. Sarah Mitchell",
    language: "Mathematics",
    subject: "Mathematics",
    price: 45,
    institution: "MIT",
    experience: "8 years",
    location: "Cambridge, MA",
    teachingMode: "Online",
    availableDays: "Mon – Fri",
    timeSlot: "4:00 PM – 8:00 PM",
    totalSlots: 8,
    reviews: 127,
    sessionStartDate: "2026-08-01",
    sessionEndDate: "2026-08-30",
    about: "PhD in Applied Mathematics from MIT. Specialises in calculus, linear algebra, and advanced statistics.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800"
  },
  {
    _id: "t2",
    name: "Prof. James Chen",
    language: "Physics",
    subject: "Physics",
    price: 50,
    institution: "Stanford University",
    experience: "12 years",
    location: "Palo Alto, CA",
    teachingMode: "Both",
    availableDays: "Tue – Sat",
    timeSlot: "5:00 PM – 9:00 PM",
    totalSlots: 6,
    reviews: 98,
    sessionStartDate: "2026-08-05",
    sessionEndDate: "2026-09-05",
    about: "Specializing in Quantum Physics and Thermodynamics with 12+ years of academic research.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800"
  },
  {
    _id: "t3",
    name: "Ms. Aisha Rahman",
    language: "English Literature",
    subject: "English Literature",
    price: 35,
    institution: "Oxford University",
    experience: "6 years",
    location: "Boston, MA",
    teachingMode: "Online",
    availableDays: "Mon – Thu",
    timeSlot: "3:00 PM – 7:00 PM",
    totalSlots: 10,
    reviews: 84,
    sessionStartDate: "2026-08-10",
    sessionEndDate: "2026-09-10",
    about: "Oxford graduate passionate about creative writing, essays, and classical literature analysis.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800"
  },
  {
    _id: "t4",
    name: "Dr. Carlos Rivera",
    language: "Chemistry",
    subject: "Chemistry",
    price: 45,
    institution: "Caltech",
    experience: "9 years",
    location: "Pasadena, CA",
    teachingMode: "Both",
    availableDays: "Wed – Sun",
    timeSlot: "2:00 PM – 6:00 PM",
    totalSlots: 4,
    reviews: 112,
    sessionStartDate: "2026-08-01",
    sessionEndDate: "2026-08-25",
    about: "Organic Chemistry specialist providing simplified step-by-step problem-solving methods.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800"
  },
  {
    _id: "t5",
    name: "Jhankar Mahbub",
    language: "Web Development",
    subject: "Web Development",
    price: 40,
    institution: "Programming Hero",
    experience: "10 years",
    location: "Dhaka, BD",
    teachingMode: "Online",
    availableDays: "Mon – Fri",
    timeSlot: "5:00 PM – 9:00 PM",
    totalSlots: 12,
    reviews: 215,
    sessionStartDate: "2026-08-01",
    sessionEndDate: "2026-09-30",
    about: "Senior Web Developer teaching JavaScript, React, and Node.js in an engaging and fun way.",
    image: "/jhankar.png"
  },
  {
    _id: "t6",
    name: "Dr. Priya Sharma",
    language: "Biology",
    subject: "Biology",
    price: 42,
    institution: "Johns Hopkins",
    experience: "7 years",
    location: "Baltimore, MD",
    teachingMode: "Both",
    availableDays: "Tue – Sat",
    timeSlot: "4:00 PM – 8:00 PM",
    totalSlots: 7,
    reviews: 91,
    sessionStartDate: "2026-08-15",
    sessionEndDate: "2026-09-15",
    about: "Biomedical researcher making Cell Biology and Genetics easy to master.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=800"
  }
];

const FindTutors = ({ user, setActiveTab, setRedirectTarget, setAuthMode }) => {
  const [tutors, setTutors] = useState(masterTutorsList);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [activeTutorDetails, setActiveTutorDetails] = useState(null);
  const [zoomImage, setZoomImage] = useState(null);

  const fetchTutors = () => {
    setLoading(true);
    axios.get(`${API_URL}/tutors`)
      .then(res => {
        if (res.data && res.data.length > 0) {
          setTutors(res.data);
        }
      })
      .catch(err => console.error("Error loading backend tutors:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  // Filter Logic
  const processedTutors = tutors.filter(t => {
    const searchLower = search.trim().toLowerCase();
    const subjectLower = subjectFilter.trim().toLowerCase();
    const modeLower = modeFilter.trim().toLowerCase();

    const matchesSearch = !searchLower || 
      t.name?.toLowerCase().includes(searchLower) || 
      t.tutorName?.toLowerCase().includes(searchLower) ||
      t.language?.toLowerCase().includes(searchLower) ||
      t.subject?.toLowerCase().includes(searchLower);

    const tutorSub = (t.subject || t.language || '').toLowerCase();
    const matchesSubject = subjectFilter === 'All' || tutorSub.includes(subjectLower);

    const tutorMode = (t.teachingMode || t.mode || 'Online').toLowerCase();
    const matchesMode = modeFilter === 'All' || tutorMode === modeLower;

    // Date Range Filter Logic
    let matchesDate = true;
    if (t.sessionStartDate) {
      const tutorStartDate = new Date(t.sessionStartDate).getTime();
      
      if (startDate) {
        const filterStart = new Date(startDate).getTime();
        if (tutorStartDate < filterStart) matchesDate = false;
      }
      
      if (endDate) {
        const filterEnd = new Date(endDate).getTime();
        if (tutorStartDate > filterEnd) matchesDate = false;
      }
    }

    return matchesSearch && matchesSubject && matchesMode && matchesDate;
  });

  if (activeTutorDetails) {
    return (
      <TutorDetails 
        tutor={activeTutorDetails} 
        user={user} 
        onBack={() => { setActiveTutorDetails(null); fetchTutors(); }} 
        setActiveTab={setActiveTab} 
        setRedirectTarget={setRedirectTarget} 
        setAuthMode={setAuthMode}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 md:px-8 max-w-7xl mx-auto space-y-8 font-sans">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Browse Tutors</h1>
        <p className="text-xs text-slate-500 font-bold mt-1">
          {loading ? 'Searching tutors...' : `${processedTutors.length} tutors found`}
        </p>
      </div>

      {/* Filter Section */}
      <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or subject..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:bg-white focus:border-blue-500 transition-all" 
          />
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full lg:w-auto">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block px-1">Start Date</span>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)} 
              className="px-2.5 py-2 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 block px-1">End Date</span>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)} 
              className="px-2.5 py-2 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 cursor-pointer"
            />
          </div>

          <div className="self-end">
            <select 
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-3 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none cursor-pointer"
            >
              <option value="All">All Subjects</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
              <option value="English">English</option>
              <option value="Chemistry">Chemistry</option>
              <option value="Biology">Biology</option>
              <option value="Web Development">Web Development</option>
            </select>
          </div>

          <div className="self-end">
            <button 
              onClick={() => { setSearch(''); setStartDate(''); setEndDate(''); setSubjectFilter('All'); setModeFilter('All'); }}
              className="px-3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 animate-pulse">
              <div className="w-full aspect-[4/3] rounded-xl bg-slate-200"></div>
              <div className="space-y-2">
                <div className="h-5 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedTutors.map(t => (
            <div 
              key={t._id || t.name} 
              className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 p-5 flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 group"
            >
              <div>
                <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black rounded-lg text-white z-10 ${t.teachingMode?.toLowerCase() === 'online' ? 'bg-cyan-600' : 'bg-blue-600'}`}>
                  {t.teachingMode || 'Online'}
                </span>

                <div className="w-full aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200/60 mb-4 relative group/img">
                  <img 
                    src={t.image || t.photoURL} 
                    alt={t.name || t.tutorName} 
                    className="w-full h-full object-cover object-top group-hover/img:scale-105 transition-all duration-500" 
                    onError={(e)=>{e.target.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800'}} 
                  />
                  <button 
                    onClick={() => setZoomImage({ src: t.image || t.photoURL, name: t.name || t.tutorName })}
                    className="absolute bottom-2 right-2 p-2 bg-slate-900/70 hover:bg-blue-600 text-white rounded-lg opacity-0 group-hover/img:opacity-100 transition-all shadow-md cursor-pointer"
                    title="Click to Zoom Full Photo"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 cursor-pointer" onClick={() => setActiveTutorDetails(t)}>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-all">{t.name || t.tutorName}</h3>
                    <p className="text-xs font-black text-blue-600">{t.language || t.subject}</p>
                  </div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                    <Star className="w-3.5 h-3.5 fill-current" /> 4.9 <span className="text-slate-400 font-bold">({t.reviews || 112} reviews)</span>
                  </div>
                  <div className="space-y-1 text-xs font-bold text-slate-500 pt-1">
                    <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {t.location || 'Cambridge, MA'}</p>
                    <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {t.timeSlot || 'Mon - Fri, 4:00 PM'}</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                <span className="text-xl font-black text-slate-900">${t.price || t.hourlyFee}<span className="text-xs text-slate-500 font-bold">/hr</span></span>
                <button onClick={() => setActiveTutorDetails(t)} className="px-4 py-2 bg-blue-600 text-white font-black text-xs rounded-xl shadow group-hover:bg-blue-700 transition-all cursor-pointer">
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {zoomImage && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setZoomImage(null)}>
          <div className="relative bg-white p-3 rounded-3xl max-w-xl w-full shadow-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center px-2 pt-1">
              <h3 className="text-sm font-black text-slate-900">{zoomImage.name}</h3>
              <button onClick={() => setZoomImage(null)} className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="w-full max-h-[75vh] overflow-hidden rounded-2xl bg-slate-100 flex items-center justify-center border">
              <img src={zoomImage.src} alt="" className="w-full h-full object-contain max-h-[70vh]" />
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FindTutors;