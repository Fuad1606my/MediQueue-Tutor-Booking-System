import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, ChevronLeft, ChevronRight, Search, Calendar, BookOpen } from 'lucide-react';
import axios from 'axios';
import TutorDetails from './TutorDetails';
import { masterTutorsList } from './FindTutors';

const slides = [
  {
    title: "Unlock Your Academic Potential",
    desc: "Connect with verified tutors across 50+ subjects and schedule sessions that fit your life.",
    bgImage: "/hero1.jpg"
  },
  {
    title: "From Struggling to Succeeding",
    desc: "Students who use MediQueue see a 40% grade improvement on average within just four weeks.",
    bgImage: "/hero2.jpg"
  },
  {
    title: "Expert Guidance, Built For You",
    desc: "Eliminate manual scheduling and prevent time slot conflicts with our optimized framework.",
    bgImage: "/hero3.jpg"
  }
];

const testimonials = [
  {
    id: 1,
    quote: '"Dr. Mitchell transformed my relationship with calculus. I went from failing to acing my midterms in just six sessions. The booking process was seamless."',
    name: "Emily Torres",
    role: "Mathematics Student",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200"
  },
  {
    id: 2,
    quote: '"Prof. Chen has an incredible ability to explain quantum mechanics in plain English. MediQueue made finding him and scheduling incredibly easy."',
    name: "Marcus Johnson",
    role: "Physics Student",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200"
  },
  {
    id: 3,
    quote: '"David helped me land my first internship by teaching me data structures in a way that actually clicked. The session token system is a brilliant touch."',
    name: "Lily Zhang",
    role: "Computer Science Student",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200"
  }
];

const Home = ({ user, setActiveTab, setRedirectTarget, setAuthMode }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tutors, setTutors] = useState(masterTutorsList.slice(0, 6));
  const [selectedHomeTutor, setSelectedHomeTutor] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    axios.get('http://localhost:5000/tutors')
      .then(res => {
        if (res.data && res.data.length > 0) {
          const cleaned = res.data.map(t => ({ ...t, price: t.price > 500 ? 40 : t.price }));
          const mergedMap = new Map();
          masterTutorsList.forEach(item => mergedMap.set(item.name.toLowerCase(), item));
          cleaned.forEach(item => mergedMap.set(item.name.toLowerCase(), item));
          setTutors(Array.from(mergedMap.values()).slice(0, 6));
        }
      })
      .catch(() => console.log("Using home synchronized fallback"));
  }, []);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  if (selectedHomeTutor) {
    return (
      <TutorDetails 
        tutor={selectedHomeTutor} 
        user={user} 
        onBack={() => setSelectedHomeTutor(null)} 
        setActiveTab={setActiveTab} 
        setRedirectTarget={setRedirectTarget} 
        setAuthMode={setAuthMode}
      />
    );
  }

  return (
    <div className="font-sans bg-slate-50 space-y-20 pb-0">
      
      {/* 🎓 1. HERO BANNER CAROUSEL */}
      <div className="relative h-[480px] md:h-[520px] overflow-hidden w-full shadow-lg group bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center flex items-center px-8 md:px-24"
            style={{ backgroundImage: `url(${slides[currentSlide].bgImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/30"></div>

            <div className="max-w-xl space-y-5 relative z-10 text-white">
              <span className="bg-blue-600/30 text-blue-300 text-[11px] font-black uppercase tracking-widest px-3.5 py-1.5 rounded-full border border-blue-400/30 backdrop-blur-md">
                EXPERT TUTORS
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                {slides[currentSlide].title}
              </h1>
              <p className="text-sm md:text-base text-slate-200 font-medium leading-relaxed max-w-lg">
                {slides[currentSlide].desc}
              </p>
              <button 
                onClick={() => setActiveTab('find')} 
                className="mt-2 inline-flex items-center gap-2 px-7 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg hover:scale-105 cursor-pointer text-xs uppercase tracking-wider"
              >
                Find a Tutor <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/50 hover:bg-blue-600 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-md">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/50 hover:bg-blue-600 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-md">
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition-all cursor-pointer ${currentSlide === i ? 'bg-white w-8' : 'bg-white/40 w-2.5'}`} />
          ))}
        </div>
      </div>

      {/* 🎓 2. AVAILABLE TUTORS SECTION */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        <div className="flex justify-between items-end border-b border-slate-200 pb-3">
          <div>
            <span className="text-xs font-black text-blue-600 uppercase tracking-widest">OUR EXPERTS</span>
            <h2 className="text-3xl font-black text-slate-900 mt-1">Available Tutors</h2>
          </div>
          <button onClick={() => setActiveTab('find')} className="text-blue-600 hover:text-blue-800 text-xs font-black flex items-center gap-1 cursor-pointer">
            View all <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tutors.map(t => (
            <div 
              key={t._id || t.name} 
              onClick={() => setSelectedHomeTutor(t)}
              className="bg-white rounded-2xl shadow-sm hover:shadow-md border border-slate-200 p-5 space-y-4 relative flex flex-col justify-between hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <span className={`absolute top-3 right-3 px-2.5 py-1 text-[10px] font-black rounded-lg text-white z-10 ${t.teachingMode === 'Online' ? 'bg-cyan-600' : 'bg-blue-600'}`}>
                {t.teachingMode || 'Online'}
              </span>
              
              <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-100 border">
                <img src={t.image} alt={t.name} className="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-300" onError={(e)=>{e.target.src='https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500'}} />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition-all">{t.name}</h3>
                <p className="text-xs font-black text-blue-600">{t.language || t.subject}</p>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-black mt-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> 4.9 <span className="text-slate-400 font-bold">({t.reviews || 112})</span>
                </div>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-3 mt-2">
                <span className="text-xl font-black text-slate-900">${t.price}<span className="text-xs text-slate-500 font-bold">/hr</span></span>
                <button className="px-4 py-2 bg-blue-600 text-white font-black text-xs rounded-xl hover:bg-blue-700 cursor-pointer shadow">
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎓 3. FIGMA: SIMPLE PROCESS (HOW MEDIQUEUE WORKS) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
            SIMPLE PROCESS
          </span>
          <h2 className="text-3xl font-black text-slate-900">How MediQueue Works</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 01 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden space-y-5 hover:shadow-md transition-all">
            <span className="text-7xl font-black text-slate-100/80 absolute right-6 top-4 select-none pointer-events-none">
              01
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center relative z-10">
              <Search className="w-5 h-5" />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-lg font-black text-slate-900">Browse Tutors</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Filter by subject, location, availability, and price to find the expert who fits your goals.
              </p>
            </div>
          </div>

          {/* Card 02 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden space-y-5 hover:shadow-md transition-all">
            <span className="text-7xl font-black text-slate-100/80 absolute right-6 top-4 select-none pointer-events-none">
              02
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center relative z-10">
              <Calendar className="w-5 h-5" />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-lg font-black text-slate-900">Book a Session</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Pick your preferred date and time. Our conflict-free system ensures every slot is guaranteed.
              </p>
            </div>
          </div>

          {/* Card 03 */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm relative overflow-hidden space-y-5 hover:shadow-md transition-all">
            <span className="text-7xl font-black text-slate-100/80 absolute right-6 top-4 select-none pointer-events-none">
              03
            </span>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center relative z-10">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-lg font-black text-slate-900">Start Learning</h3>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                Get your digital session token, join the session, and start hitting the grades you deserve.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* 🎓 4. FIGMA: STUDENT STORIES (TESTIMONIALS) */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center space-y-1">
          <span className="text-[11px] font-black text-blue-600 uppercase tracking-widest">
            STUDENT STORIES
          </span>
          <h2 className="text-3xl font-black text-slate-900">What Our Students Say</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(item => (
            <div key={item.id} className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6 hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="flex text-amber-400 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-medium text-slate-600 leading-relaxed">
                  {item.quote}
                </p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <img src={item.image} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div>
                  <h4 className="text-xs font-black text-slate-900">{item.name}</h4>
                  <p className="text-[10px] font-bold text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 🎓 5. FIGMA: VIBRANT BLUE STATS BANNER */}
      <div className="bg-blue-600 py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">1,200+</h3>
            <p className="text-xs font-black text-blue-100 uppercase tracking-wider">Active Students</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">180+</h3>
            <p className="text-xs font-black text-blue-100 uppercase tracking-wider">Expert Tutors</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">50+</h3>
            <p className="text-xs font-black text-blue-100 uppercase tracking-wider">Subjects Covered</p>
          </div>
          <div className="space-y-1">
            <h3 className="text-3xl md:text-4xl font-black tracking-tight">4.8★</h3>
            <p className="text-xs font-black text-blue-100 uppercase tracking-wider">Average Rating</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;