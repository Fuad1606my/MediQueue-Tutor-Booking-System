import React, { useEffect, useState } from 'react';
import { Search, Star, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import TutorDetails from './TutorDetails';

// 🎓১০০% সিঙ্ক করা মাস্টার টিউটর ডাটাবেজ (Home ও Tutors ট্যাবে হুবহু এক ডাটা)
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
    about: "PhD in Applied Mathematics from MIT. Specialises in calculus, linear algebra, and advanced statistics.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500"
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
    about: "Specializing in Quantum Physics and Thermodynamics with 12+ years of academic research.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500"
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
    about: "Oxford graduate passionate about creative writing, essays, and classical literature analysis.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500"
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
    about: "Organic Chemistry specialist providing simplified step-by-step problem-solving methods.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500"
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
    about: "Senior Web Developer teaching JavaScript, React, and Node.js in an engaging and fun way.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=500"
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
    about: "Biomedical researcher making Cell Biology and Genetics easy to master.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500"
  },
  {
    _id: "t7",
    name: "Dr. Angela Yu",
    language: "Computer Science",
    subject: "Computer Science",
    price: 55,
    institution: "London App Brewery",
    experience: "11 years",
    location: "London, UK",
    teachingMode: "Online",
    availableDays: "Mon – Fri",
    timeSlot: "2:00 PM – 6:00 PM",
    totalSlots: 9,
    reviews: 189,
    about: "Lead Instructor teaching Full Stack Web Development and Python.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500"
  },
  {
    _id: "t8",
    name: "Hitesh Choudhary",
    language: "JavaScript & Coding",
    subject: "Computer Science",
    price: 38,
    institution: "Chai aur Code",
    experience: "9 years",
    location: "Jaipur, IN",
    teachingMode: "Online",
    availableDays: "Tue – Sun",
    timeSlot: "5:00 PM – 9:00 PM",
    totalSlots: 15,
    reviews: 176,
    about: "System Architect teaching Node.js, System Design, and JavaScript fundamentals.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500"
  },
  {
    _id: "t9",
    name: "Paula Scher",
    language: "Graphics Design",
    subject: "Graphics Design",
    price: 48,
    institution: "Pentagram Studio",
    experience: "15 years",
    location: "New York, NY",
    teachingMode: "Both",
    availableDays: "Mon – Thu",
    timeSlot: "10:00 AM – 2:00 PM",
    totalSlots: 5,
    reviews: 142,
    about: "World-renowned Graphic Designer teaching UI/UX and Typography.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500"
  },
  {
    _id: "t10",
    name: "Jeson",
    language: "Mathematics",
    subject: "Mathematics",
    price: 45,
    institution: "Harvard",
    experience: "5 years",
    location: "Boston, MA",
    teachingMode: "Online",
    availableDays: "Mon – Fri",
    timeSlot: "6:00 PM – 10:00 PM",
    totalSlots: 8,
    reviews: 112,
    about: "Specialist in Algebra and Advanced Geometry for high school and college students.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500"
  }
];

const FindTutors = ({ user, setActiveTab, setRedirectTarget, setAuthMode }) => {
  const [tutors, setTutors] = useState(masterTutorsList);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [activeTutorDetails, setActiveTutorDetails] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/tutors')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const cleanedBackend = res.data.map(t => ({ ...t, price: t.price > 500 ? 40 : t.price }));
          const mergedMap = new Map();
          masterTutorsList.forEach(item => mergedMap.set(item.name.toLowerCase(), item));
          cleanedBackend.forEach(item => mergedMap.set(item.name.toLowerCase(), item));
          setTutors(Array.from(mergedMap.values()));
        }
      })
      .catch(() => console.log("Using unified tutors dataset"));
  }, []);

  // 🔍 সার্চ + সাবজেক্ট ফিল্টার + টিচিং মোড ফিল্টার লজিক
  const filtered = tutors.filter(t => {
    const matchesSearch = 
      t.name?.toLowerCase().includes(search.toLowerCase()) || 
      t.language?.toLowerCase().includes(search.toLowerCase()) ||
      t.subject?.toLowerCase().includes(search.toLowerCase());

    const matchesSubject = subjectFilter === 'All' || 
      (t.subject && t.subject.toLowerCase() === subjectFilter.toLowerCase()) ||
      (t.language && t.language.toLowerCase().includes(subjectFilter.toLowerCase()));

    const matchesMode = modeFilter === 'All' || 
      (t.teachingMode && t.teachingMode.toLowerCase() === modeFilter.toLowerCase());

    return matchesSearch && matchesSubject && matchesMode;
  });

  if (activeTutorDetails) {
    return (
      <TutorDetails 
        tutor={activeTutorDetails} 
        user={user} 
        onBack={() => setActiveTutorDetails(null)} 
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
          {filtered.length} tutors found
        </p>
      </div>

      {/* 🔍 FIGMA STYLE SEARCH BAR WITH DROPDOWN FILTERS */}
      <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or subject..." 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-800 shadow-sm focus:outline-none focus:bg-white focus:border-blue-500 transition-all" 
          />
        </div>

        {/* Filters Group */}
        <div className="flex gap-3 w-full md:w-auto">
          {/* Subject Filter Dropdown */}
          <select 
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="w-1/2 md:w-48 px-3 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Subjects</option>
            <option value="Mathematics">Mathematics</option>
            <option value="Physics">Physics</option>
            <option value="English Literature">English Literature</option>
            <option value="Chemistry">Chemistry</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Biology">Biology</option>
            <option value="Web Development">Web Development</option>
            <option value="Graphics Design">Graphics Design</option>
          </select>

          {/* Mode Filter Dropdown */}
          <select 
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value)}
            className="w-1/2 md:w-36 px-3 py-2.5 bg-slate-100/80 border border-slate-200/80 rounded-xl text-xs font-bold text-slate-700 shadow-sm focus:outline-none focus:bg-white focus:border-blue-500 cursor-pointer"
          >
            <option value="All">All Modes</option>
            <option value="Online">Online</option>
            <option value="Offline">Offline</option>
            <option value="Both">Both</option>
          </select>
        </div>

      </div>

      {/* Tutors 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(t => (
          <div 
            key={t._id || t.name} 
            onClick={() => setActiveTutorDetails(t)}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-200 p-5 flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
          >
            <div>
              <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black rounded-lg text-white z-10 ${t.teachingMode === 'Online' ? 'bg-cyan-600' : 'bg-blue-600'}`}>
                {t.teachingMode || 'Online'}
              </span>

              <div className="w-full h-48 rounded-xl overflow-hidden bg-slate-100 border mb-4">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" onError={(e)=>{e.target.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500'}} />
              </div>

              <div className="space-y-2">
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-all">{t.name}</h3>
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
              <span className="text-xl font-black text-slate-900">${t.price}<span className="text-xs text-slate-500 font-bold">/hr</span></span>
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