import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const homeDisplayTutors = [
  {
    _id: "u1",
    name: "Dr. Sarah Mitchell",
    language: "Mathematics",
    price: 45,
    teachingMode: "Online",
    reviews: 127,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500"
  },
  {
    _id: "u5",
    name: "Jhankar Mahbub",
    language: "Bengali, English & Web Dev",
    price: 40,
    teachingMode: "Online",
    reviews: 215,
    image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=500"
  },
  {
    _id: "u7",
    name: "Dr. Angela Yu",
    language: "English & Web Dev",
    price: 55,
    teachingMode: "Online",
    reviews: 189,
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=500"
  },
  {
    _id: "u8",
    name: "Hitesh Choudhary",
    language: "English, Hindi & Coding",
    price: 38,
    teachingMode: "Online",
    reviews: 176,
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500"
  },
  {
    _id: "u9",
    name: "Paula Scher",
    language: "Graphics Design",
    price: 48,
    teachingMode: "Both",
    reviews: 142,
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=500"
  },
  {
    _id: "u2",
    name: "Prof. James Chen",
    language: "Physics",
    price: 50,
    teachingMode: "Both",
    reviews: 98,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=500"
  }
];

// 🎓 Directly Linked to your client/public Folder Images!
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

const Home = ({ setActiveTab }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [tutors, setTutors] = useState(homeDisplayTutors);

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
          const merged = [...cleaned, ...homeDisplayTutors];
          const unique = Array.from(new Map(merged.map(item => [item.name.toLowerCase(), item])).values());
          setTutors(unique.slice(0, 6));
        }
      })
      .catch(err => console.log("Using home default fallback"));
  }, []);

  const handleNext = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const handlePrev = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="font-sans bg-slate-50 space-y-16 pb-16">
      
      {/* 🎓 Figma Hero Banner with Public Folder Images */}
      <div className="relative h-[480px] md:h-[520px] overflow-hidden w-full shadow-lg group bg-slate-900">
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-cover bg-center flex items-center px-8 md:px-24"
            style={{ 
              backgroundImage: `url(${slides[currentSlide].bgImage})` 
            }}
          >
            {/* Dark Gradient Overlay for Crisp Text Readability */}
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

        {/* Navigation Controls */}
        <button onClick={handlePrev} className="absolute left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/50 hover:bg-blue-600 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-md">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={handleNext} className="absolute right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-slate-900/50 hover:bg-blue-600 text-white flex items-center justify-center transition-all cursor-pointer z-20 shadow-md">
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {slides.map((_, i) => (
            <button key={i} onClick={() => setCurrentSlide(i)} className={`h-2.5 rounded-full transition-all cursor-pointer ${currentSlide === i ? 'bg-white w-8' : 'bg-white/40 w-2.5'}`} />
          ))}
        </div>
      </div>

      {/* Available Tutors */}
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
              onClick={() => setActiveTab('find')}
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

    </div>
  );
};

export default Home;