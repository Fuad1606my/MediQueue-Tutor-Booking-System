import React, { useEffect, useState } from 'react';
import { Search, Star, MapPin, Clock } from 'lucide-react';
import axios from 'axios';
import TutorDetails from './TutorDetails';

// আপনার আগের ডাটাবেজের টিউটর + নতুন ফিগমা টিউটরদের কম্বাইন্ড অরিজিনাল লিস্ট
const combinedAllTutors = [
  {
    _id: "u1",
    name: "Dr. Sarah Mitchell",
    language: "Mathematics",
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
    _id: "u2",
    name: "Prof. James Chen",
    language: "Physics",
    price: 50,
    institution: "Stanford University",
    experience: "12 years",
    location: "Palo Alto, CA",
    teachingMode: "Both",
    availableDays: "Tue – Sat",
    timeSlot: "5:00 PM – 9:00 PM",
    totalSlots: 6,
    reviews: 98,
    about: "Specializing in Quantum Physics and Thermodynamics with 12+ years of academic research and tutoring experience.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500"
  },
  {
    _id: "u3",
    name: "Ms. Aisha Rahman",
    language: "English Literature",
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
    _id: "u4",
    name: "Dr. Carlos Rivera",
    language: "Chemistry",
    price: 45,
    institution: "Caltech",
    experience: "9 years",
    location: "Pasadena, CA",
    teachingMode: "Both",
    availableDays: "Wed – Sun",
    timeSlot: "2:00 PM – 6:00 PM",
    totalSlots: 4,
    reviews: 112,
    about: "Organic Chemistry specialist providing simplified step-by-step problem-solving methods for complex reactions.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500"
  },
  {
    _id: "u5",
    name: "Jhankar Mahbub",
    language: "Bengali, English & Web Dev",
    price: 40,
    institution: "Programming Hero",
    experience: "10 years",
    location: "Dhaka, BD",
    teachingMode: "Online",
    availableDays: "Mon – Fri",
    timeSlot: "5:00 PM – 9:00 PM",
    totalSlots: 12,
    reviews: 215,
    about: "Senior Web Developer teaching JavaScript, React, and Node.js in an engaging, intuitive and fun way.",
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=500"
  },
  {
    _id: "u6",
    name: "Dr. Priya Sharma",
    language: "Biology",
    price: 42,
    institution: "Johns Hopkins",
    experience: "7 years",
    location: "Baltimore, MD",
    teachingMode: "Both",
    availableDays: "Tue – Sat",
    timeSlot: "4:00 PM – 8:00 PM",
    totalSlots: 7,
    reviews: 91,
    about: "Biomedical researcher making Cell Biology, Genetics, and Human Physiology easy to master.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500"
  },
  {
    _id: "u7",
    name: "Dr. Angela Yu",
    language: "English & Web Dev",
    price: 55,
    institution: "London App Brewery",
    experience: "11 years",
    location: "Dhaka, BD",
    teachingMode: "Online",
    availableDays: "Mon – Fri",
    timeSlot: "5:00 PM – 9:00 PM",
    totalSlots: 9,
    reviews: 189,
    about: "Lead Instructor teaching Full Stack Web Development, Python, and Mobile App Architecture.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500"
  },
  {
    _id: "u8",
    name: "Hitesh Choudhary",
    language: "English, Hindi & Coding",
    price: 38,
    institution: "Chai aur Code",
    experience: "9 years",
    location: "Dhaka, BD",
    teachingMode: "Online",
    availableDays: "Mon – Fri",
    timeSlot: "5:00 PM – 9:00 PM",
    totalSlots: 15,
    reviews: 176,
    about: "System Architect teaching Node.js, System Design, DevOps, and JavaScript fundamentals.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500"
  },
  {
    _id: "u9",
    name: "Paula Scher",
    language: "Graphics Design",
    price: 48,
    institution: "Pentagram Studio",
    experience: "15 years",
    location: "Dhaka, BD",
    teachingMode: "Online",
    availableDays: "Mon – Thu",
    timeSlot: "10:00 AM – 2:00 PM",
    totalSlots: 5,
    reviews: 142,
    about: "World-renowned Graphic Designer teaching UI/UX, Typography, Branding, and Visual Identity.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500"
  }
];

const FindTutors = ({ user, setActiveTab, setRedirectTarget, setAuthMode }) => {
  const [tutors, setTutors] = useState(combinedAllTutors);
  const [search, setSearch] = useState('');
  const [activeTutorDetails, setActiveTutorDetails] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/tutors')
      .then(res => {
        if (res.data && res.data.length > 0) {
          // ব্যাক-এন্ডের $5500 অনাকাঙ্ক্ষিত অসামঞ্জস্য ফিক্স করে মার্জ করা হচ্ছে
          const cleanedBackend = res.data.map(t => ({
            ...t,
            price: t.price > 500 ? 40 : t.price
          }));

          // ডাটা কম্বাইন মেকানিজম (ডুপ্লিকেট বাদ দিয়ে আগের + নতুন দুটোই রাখা)
          const mergedMap = new Map();
          combinedAllTutors.forEach(item => mergedMap.set(item.name.toLowerCase(), item));
          cleanedBackend.forEach(item => mergedMap.set(item.name.toLowerCase(), item));

          setTutors(Array.from(mergedMap.values()));
        }
      })
      .catch(err => console.log("Using unified master tutors dataset"));
  }, []);

  const filtered = tutors.filter(t => 
    t.name?.toLowerCase().includes(search.toLowerCase()) || 
    t.language?.toLowerCase().includes(search.toLowerCase()) ||
    t.subject?.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Browse Tutors</h1>
          <p className="text-xs text-slate-500 font-bold mt-1">Showing {filtered.length} verified academic experts</p>
        </div>
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
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {t.location || 'Dhaka, BD'}</p>
                  <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-400" /> {t.timeSlot || 'Mon - Fri, 5:00 PM'}</p>
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
